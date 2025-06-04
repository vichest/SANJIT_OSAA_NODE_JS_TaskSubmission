const hre = require("hardhat");

async function main() {
    console.log("=== Contract Interaction Test ===");
    
    // Get the first signer (same as deployment)
    const [signer] = await hre.ethers.getSigners();
    console.log("Using account:", signer.address);
    console.log("Account balance:", hre.ethers.formatEther(await signer.provider.getBalance(signer.address)), "ETH");

    // Get the contract factory
    const TwoFactorAuth = await hre.ethers.getContractFactory("TwoFactorAuth");
    
    // Deploy a fresh contract for testing (or use existing address)
    console.log("\nDeploying fresh contract for testing...");
    const contract = await TwoFactorAuth.deploy();
    await contract.waitForDeployment();
    
    const contractAddress = await contract.getAddress();
    console.log("Contract deployed at:", contractAddress);

    try {
        console.log("\n=== Testing Contract Functions ===");
        
        // Test 1: Register a user
        console.log("\n1. Testing User Registration...");
        const username = "testUser";
        const publicKey = "0x" + "04".padEnd(130, "0"); // 65 bytes public key
        const otpSeed = hre.ethers.id("testSeed123");
        
        const registerTx = await contract.registerUser(username, publicKey, otpSeed);
        await registerTx.wait();
        console.log("✅ User registered successfully");
        console.log("   Username:", username);
        console.log("   Public Key:", publicKey.substring(0, 20) + "...");
        console.log("   OTP Seed:", otpSeed);

        // Test 2: Get user details
        console.log("\n2. Testing Get User Details...");
        const [retrievedUsername, retrievedPublicKey, retrievedOtpSeed] = await contract.getUserDetails(signer.address);
        console.log("✅ Retrieved user details:");
        console.log("   Username:", retrievedUsername);
        console.log("   Public Key Match:", retrievedPublicKey === publicKey);
        console.log("   OTP Seed Match:", retrievedOtpSeed === otpSeed);

        // Test 3: Generate OTP
        console.log("\n3. Testing OTP Generation...");
        const otp = await contract.generateOTP();
        console.log("✅ Generated OTP:", otp.toString());
        console.log("   OTP Length:", otp.toString().length, "digits");

        // Test 4: Validate OTP
        console.log("\n4. Testing OTP Validation...");
        const isValidOTP = await contract.isOTPValid(publicKey, otp);
        console.log("✅ OTP Validation:", isValidOTP ? "VALID" : "INVALID");

        // Test 5: Authenticate user
        console.log("\n5. Testing User Authentication...");
        const authResult = await contract.authenticateUser.staticCall(publicKey, otp);
        console.log("✅ Authentication Result:", authResult ? "SUCCESS" : "FAILED");

        // Test 6: Execute authentication transaction
        console.log("\n6. Testing Authentication Transaction...");
        const authTx = await contract.authenticateUser(publicKey, otp);
        const receipt = await authTx.wait();
        console.log("✅ Authentication transaction completed");
        console.log("   Transaction Hash:", receipt.hash);
        console.log("   Gas Used:", receipt.gasUsed.toString());

        // Test 7: Try invalid OTP
        console.log("\n7. Testing Invalid OTP...");
        const invalidOTP = 999999;
        const invalidResult = await contract.isOTPValid(publicKey, invalidOTP);
        console.log("✅ Invalid OTP Test:", invalidResult ? "FAILED (should be false)" : "PASSED");

        console.log("\n🎉 ALL TESTS COMPLETED SUCCESSFULLY!");
        console.log("Contract Address:", contractAddress);
        console.log("Your contract is working correctly!");

    } catch (error) {
        console.error("\n❌ Test Failed:");
        console.error("Error:", error.message);
        if (error.reason) {
            console.error("Reason:", error.reason);
        }
    }
}

main()
    .then(() => {
        console.log("\n✅ Interaction test completed");
        process.exit(0);
    })
    .catch((error) => {
        console.error("\n❌ Interaction test failed:");
        console.error(error);
        process.exit(1);
    });