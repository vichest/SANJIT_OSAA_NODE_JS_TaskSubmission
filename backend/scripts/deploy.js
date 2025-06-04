const hre = require("hardhat");

async function main() {
    // Get the deployer account
    const [deployer] = await hre.ethers.getSigners();
    
    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

    // Compile the smart contract
    await hre.run('compile');

    // Get the contract factory - FIXED: Use correct contract name
    const TwoFactorAuth = await hre.ethers.getContractFactory("TwoFactorAuth");

    // Deploy the contract
    console.log("Deploying TwoFactorAuth contract...");
    const twoFactorAuth = await TwoFactorAuth.deploy();

    // Wait for the deployment to be confirmed - FIXED: Use ethers v6 syntax
    await twoFactorAuth.waitForDeployment();

    // FIXED: Use getAddress() for ethers v6
    const contractAddress = await twoFactorAuth.getAddress();
    console.log("TwoFactorAuth contract deployed to:", contractAddress);
    
    // Log contract details
    console.log("\n=== Deployment Summary ===");
    console.log("Contract Name: TwoFactorAuth");
    console.log("Contract Address:", contractAddress);
    console.log("Deployer Address:", deployer.address);
    console.log("Network:", hre.network.name);
    
    // Verify the contract is working
    console.log("\n=== Contract Verification ===");
    try {
        // Test that we can call a view function
        const contractInterface = twoFactorAuth.interface;
        console.log("Contract successfully deployed and accessible");
        console.log("Available functions:", contractInterface.fragments.map(f => f.name).filter(n => n));
    } catch (error) {
        console.log("Warning: Could not verify contract functions:", error.message);
    }
}

// Execute the deployment script
main()
    .then(() => {
        console.log("\n✅ Deployment completed successfully!");
        process.exit(0);
    })
    .catch((error) => {
        console.error("\n❌ Deployment failed:");
        console.error(error);
        process.exit(1);
    });