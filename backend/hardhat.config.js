require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: __dirname + "/.env" });

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200, // Low runs value for smaller contract size
      },
      viaIR: true, // This enables the IR compiler to handle stack too deep issues
    },
  },
  sourcify: {
    enabled: true,
  },
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY,
    },
  },
  networks: {
    // Local Hardhat network (default)
    hardhat: {
      chainId: 1337,
      // You can configure additional settings here if needed
      // accounts: [] // Uses default hardhat accounts
    },
    
    // Local network (when running `npx hardhat node`)
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 1337,
      // Uses the same accounts as hardhat network
    },
    
    // Sepolia testnet
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/tbG-68_qjk99I8BdZc7uv-ZV87gVlpvp`,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 11155111,
    },
  },
  
  // Gas reporter configuration (optional)
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  
  // Paths configuration
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
};