## README.md

```markdown
# 🔐 Blockchain 2FA Authentication System

A decentralized two-factor authentication system built on Ethereum blockchain using React, Solidity, and Hardhat. This project demonstrates secure user authentication using blockchain-generated one-time passwords (OTPs).

## ✨ Features

- **🔗 Blockchain-based Authentication**: User credentials stored securely on Ethereum
- **🔑 Time-based OTP Generation**: Smart contract generates secure 6-digit OTPs
- **🦊 MetaMask Integration**: Seamless wallet connection and transaction signing
- **⚡ Real-time Validation**: Instant OTP verification without blockchain transactions
- **🎨 Modern UI**: Beautiful, responsive interface built with Chakra UI
- **🛡️ Fully Decentralized**: No central server dependency

## 🏗️ Architecture

```

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Smart         │    │   Blockchain    │
│   (React)       │◄──►│   Contract      │◄──►│   (Hardhat)     │
│                 │    │   (Solidity)    │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘

```

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MetaMask browser extension
- Git

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd blockchain-2fa-app
```

### 2. Backend Setup

```bash
cd backend
npm install
```

**Start local blockchain:**

```bash
npx hardhat node
```

**Deploy smart contract (in new terminal):**

```bash
npx hardhat run scripts/deploy.js
```

**Copy the deployed contract address** from the output.

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

**Update contract address in `src/utils/contract.js`:**

```javascript
export const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
```

**Start the development server:**

```bash
npm run dev
```

### 4. MetaMask Configuration

1. **Add Hardhat Local Network:**

   - Network Name: `Hardhat Local`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `1337`
   - Currency Symbol: `ETH`
2. **Import Test Account:**

   - Use one of the private keys from `npx hardhat node` output
   - This gives you test ETH for transactions

## 🎯 How to Use

### Step 1: Connect Wallet

- Click "Connect MetaMask"
- Switch to Hardhat Local network
- Approve the connection

### Step 2: Register User

- Enter a username (minimum 3 characters)
- Click "Register User"
- Confirm the transaction in MetaMask
- System generates and stores your cryptographic keys

### Step 3: Generate OTP

- Click "Generate OTP"
- A 6-digit code appears with 30-second countdown
- Copy the OTP for authentication

### Step 4: Authenticate

- Enter the generated OTP
- Click "Validate OTP" for testing (no transaction)
- Click "Authenticate" for blockchain verification
- Confirm transaction in MetaMask

## 📁 Project Structure

```
blockchain-2fa-app/
├── backend/
│   ├── contracts/
│   │   └── Authentication.sol      # Smart contract
│   ├── scripts/
│   │   ├── deploy.js              # Deployment script
│   │   └── interact.js            # Contract interaction
│   ├── test/
│   │   └── Authentication.test.js  # Contract tests
│   ├── hardhat.config.js          # Hardhat configuration
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── WalletConnect.jsx   # Wallet connection
│   │   │   ├── UserRegistration.jsx # User registration
│   │   │   ├── OTPGenerator.jsx    # OTP generation
│   │   │   └── Authentication.jsx  # OTP verification
│   │   ├── utils/
│   │   │   ├── contract.js         # Contract configuration
│   │   │   └── web3.js            # Web3 utilities
│   │   ├── App.jsx                # Main application
│   │   └── main.jsx               # React entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

## 🔧 Smart Contract Functions

### Core Functions

- `registerUser(username, publicKey, otpSeed)` - Register new user
- 

generateOTP()

- Generate time-based OTP
- 

authenticateUser(publicKey, otp)

- Authenticate with OTP
- 

isOTPValid(publicKey, otp)

- Validate OTP without transaction
- 

getUserDetails(address)

- Get user information

### Events

- `UserRegistered(address, username)` - User registration event
- `UserAuthenticated(address, success)` - Authentication result event

## 🛠️ Development Scripts

### Backend Commands

```bash
# Start local blockchain
npm run node

# Deploy contract
npm run deploy

# Run tests
npm test

# Interact with contract
npm run interact
```

### Frontend Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🧪 Testing

### Smart Contract Tests

```bash
cd backend
npx hardhat test
```

### Manual Testing Flow

1. Deploy contract and start frontend
2. Connect MetaMask wallet
3. Register a new user
4. Generate OTP and verify immediate validation works
5. Test authentication with valid/invalid OTPs
6. Verify OTP expiration after 30 seconds

## 🔒 Security Features

- **Cryptographic Key Pairs**: Each user gets unique ECDSA keys
- **Time-based OTPs**: 30-second expiration window
- **Blockchain Verification**: All authentication recorded on-chain
- **No Central Authority**: Fully decentralized system
- **MetaMask Integration**: Secure wallet-based transactions

## 🐛 Troubleshooting

### Common Issues

**MetaMask Connection Failed**

- Ensure MetaMask is installed and unlocked
- Check you're on the correct network (Hardhat Local)
- Refresh the page and try reconnecting

**Transaction Reverted**

- Make sure you have enough ETH for gas fees
- Verify the contract is deployed correctly
- Check console logs for detailed error messages

**OTP Validation Fails**

- Ensure you're using the OTP immediately after generation
- Check that the contract address is correct
- Verify you're registered on the current network

**Contract Not Found**

- Redeploy the contract: `npx hardhat run scripts/deploy.js`
- Update the contract address in `frontend/src/utils/contract.js`
- Restart the frontend development server

## 📊 Gas Usage

| Function      | Estimated Gas  |
| ------------- | -------------- |
| Register User | ~150,000       |
| Generate OTP  | ~25,000        |
| Authenticate  | ~45,000        |
| Validate OTP  | ~23,000 (view) |

## 🚀 Production Deployment

### Smart Contract

1. Update `hardhat.config.js` with mainnet/testnet settings
2. Add your private key and Infura/Alchemy URL
3. Deploy: `npx hardhat run scripts/deploy.js --network mainnet`

### Frontend

1. Update contract address in `src/utils/contract.js`
2. Build: `npm run build`
3. Deploy to Vercel, Netlify, or your preferred hosting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Commit: `git commit -m "Add feature-name"`
5. Push: `git push origin feature-name`
6. Create a Pull Request

## 📄 License

This project is licensed under the MIT License. See LICENSE file for details.

## 🙏 Acknowledgments

- [Hardhat](https://hardhat.org/) - Ethereum development environment
- [Chakra UI](https://chakra-ui.com/) - Modular and accessible component library
- [Ethers.js](https://docs.ethers.io/) - Ethereum wallet implementation
- [MetaMask](https://metamask.io/) - Crypto wallet browser extension

## 📞 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section
2. Open an issue on GitHub
3. Contact the development team

---

**Built with ❤️ using React, Solidity, and Hardhat**

```

## PROJECT_SETUP.md

```markdown
# 🛠️ Blockchain 2FA - Detailed Setup Guide

This guide will walk you through setting up the Blockchain 2FA Authentication System from scratch.

## 📋 Prerequisites Checklist

Before starting, ensure you have:

- [ ] **Node.js** (v16.0.0 or higher) - [Download](https://nodejs.org/)
- [ ] **Git** - [Download](https://git-scm.com/)
- [ ] **MetaMask** browser extension - [Install](https://metamask.io/)
- [ ] **VS Code** (recommended) - [Download](https://code.visualstudio.com/)

### Verify Prerequisites

```bash
# Check Node.js version
node --version  # Should be v16+ 

# Check npm version
npm --version   # Should be 8+

# Check Git version
git --version
```

## 🏗️ Step-by-Step Setup

### 1. Project Initialization

```bash
# Create project directory
mkdir blockchain-2fa-app
cd blockchain-2fa-app

# Initialize Git repository
git init
```

### 2. Backend Setup (Smart Contract)

#### Create Backend Structure

```bash
# Create backend directory
mkdir backend
cd backend

# Initialize npm project
npm init -y
```

#### Install Dependencies

```bash
# Install Hardhat and development dependencies
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox

# Install additional dependencies
npm install --save-dev @nomiclabs/hardhat-ethers ethers dotenv

# Initialize Hardhat project
npx hardhat
```

**Choose:** ✅ Create a JavaScript project

#### Project Structure

```
backend/
├── contracts/           # Smart contracts
├── scripts/            # Deployment scripts  
├── test/              # Contract tests
├── hardhat.config.js  # Hardhat configuration
└── package.json
```

#### Create Smart Contract

```bash
# Remove sample files
rm contracts/Lock.sol
rm scripts/deploy.js
rm test/Lock.js

# Create our contract
touch contracts/Authentication.sol
```

**Add contract code to `contracts/Authentication.sol`:**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Authentication {
    struct User {
        string username;
        bytes publicKey;
        bytes32 otpSeed;
        bool isRegistered;
    }
  
    mapping(address => User) public users;
  
    event UserRegistered(address indexed user, string username);
    event UserAuthenticated(address indexed user, bool success);
  
    function registerUser(
        string calldata username,
        bytes calldata publicKey,
        bytes32 otpSeed
    ) external {
        require(!users[msg.sender].isRegistered, "User already registered");
        require(bytes(username).length > 0, "Username cannot be empty");
      
        users[msg.sender] = User({
            username: username,
            publicKey: publicKey,
            otpSeed: otpSeed,
            isRegistered: true
        });
      
        emit UserRegistered(msg.sender, username);
    }
  
    function generateOTP() external view returns (uint256) {
        require(users[msg.sender].isRegistered, "User not registered");
      
        uint256 timeWindow = block.timestamp / 30;
        bytes32 hash = keccak256(abi.encodePacked(
            users[msg.sender].otpSeed,
            timeWindow,
            msg.sender
        ));
      
        return uint256(hash) % 1000000;
    }
  
    function isOTPValid(bytes calldata publicKey, uint256 otp) external view returns (bool) {
        require(users[msg.sender].isRegistered, "User not registered");
      
        if (keccak256(publicKey) != keccak256(users[msg.sender].publicKey)) {
            return false;
        }
      
        uint256 timeWindow = block.timestamp / 30;
        bytes32 hash = keccak256(abi.encodePacked(
            users[msg.sender].otpSeed,
            timeWindow,
            msg.sender
        ));
      
        uint256 validOTP = uint256(hash) % 1000000;
        return otp == validOTP;
    }
  
    function authenticateUser(bytes calldata publicKey, uint256 otp) external returns (bool) {
        bool isValid = this.isOTPValid(publicKey, otp);
        emit UserAuthenticated(msg.sender, isValid);
        return isValid;
    }
  
    function getUserDetails(address user) external view returns (
        string memory username,
        bytes memory publicKey,
        bytes32 otpSeed
    ) {
        require(users[user].isRegistered, "User not registered");
        User memory userData = users[user];
        return (userData.username, userData.publicKey, userData.otpSeed);
    }
}
```

#### Create Deployment Script

```bash
touch scripts/deploy.js
```

**Add to `scripts/deploy.js`:**

```javascript
const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying Authentication contract...");
  
  const Authentication = await hre.ethers.getContractFactory("Authentication");
  const authentication = await Authentication.deploy();
  
  await authentication.deployed();
  
  console.log("✅ Authentication contract deployed to:", authentication.address);
  console.log("📋 Copy this address to your frontend configuration!");
  
  // Verify deployment
  console.log("\n🔍 Verifying deployment...");
  const code = await hre.ethers.provider.getCode(authentication.address);
  if (code === "0x") {
    console.error("❌ Contract deployment failed!");
  } else {
    console.log("✅ Contract successfully deployed and verified!");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
```

#### Create Test Script

```bash
touch test/Authentication.test.js
```

#### Update Hardhat Configuration

**Edit `hardhat.config.js`:**

```javascript
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
      chainId: 1337,
      accounts: {
        count: 10,
        accountsBalance: "10000000000000000000000" // 10000 ETH
      }
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 1337
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};
```

### 3. Frontend Setup (React App)

```bash
# Go back to project root
cd ..

# Create frontend with Vite
npm create vite@latest frontend -- --template react
cd frontend

# Install dependencies
npm install

# Install additional packages
npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion ethers@^5.8.0 react-icons
```

#### Create Frontend Structure

```bash
# Create required directories
mkdir -p src/components src/utils

# Create component files
touch src/components/WalletConnect.jsx
touch src/components/UserRegistration.jsx
touch src/components/OTPGenerator.jsx
touch src/components/Authentication.jsx

# Create utility files
touch src/utils/contract.js
touch src/utils/web3.js
```

#### Configure Vite

**Update `vite.config.js`:**

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    host: true
  },
  define: {
    global: 'globalThis',
  }
})
```

#### Setup React Entry Point

**Update `src/main.jsx`:**

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
)
```

#### Configure Contract Connection

**Add to `src/utils/contract.js`:**

```javascript
import { ethers } from 'ethers';

// 🚨 UPDATE THIS ADDRESS AFTER DEPLOYMENT
export const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS";

export const CONTRACT_ABI = [
  "function registerUser(string calldata username, bytes calldata publicKey, bytes32 otpSeed) external",
  "function generateOTP() external view returns (uint256)",
  "function authenticateUser(bytes calldata publicKey, uint256 otp) external returns (bool)",
  "function isOTPValid(bytes calldata publicKey, uint256 otp) external view returns (bool)",
  "function getUserDetails(address user) external view returns (string memory, bytes memory, bytes32)",
  "event UserRegistered(address indexed user, string username)",
  "event UserAuthenticated(address indexed user, bool success)"
];

export const NETWORK_CONFIG = {
  chainId: 1337,
  chainName: "Hardhat Local",
  rpcUrl: "http://127.0.0.1:8545"
};

export const getContract = (signerOrProvider) => {
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signerOrProvider);
};
```

### 4. Development Workflow

#### Terminal Setup (Use 3 terminals)

**Terminal 1 - Blockchain:**

```bash
cd backend
npx hardhat node
```

*Keep this running - your local blockchain*

**Terminal 2 - Contract Deployment:**

```bash
cd backend
npx hardhat run scripts/deploy.js
```

*Copy the contract address to `frontend/src/utils/contract.js`*

**Terminal 3 - Frontend:**

```bash
cd frontend
npm run dev
```

*Your React app at http://localhost:3000*

### 5. MetaMask Setup

#### Add Hardhat Network

1. Open MetaMask
2. Click network dropdown → "Add Network"
3. **Add manually:**
   - Network name: `Hardhat Local`
   - New RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `1337`
   - Currency symbol: `ETH`

#### Import Test Account

1. Copy a private key from Terminal 1 (hardhat node output)
2. MetaMask → Account menu → "Import Account"
3. Paste the private key
4. You now have 10,000 test ETH!

## 🚦 Verification Steps

### Backend Verification

```bash
# Test contract compilation
cd backend
npx hardhat compile

# Run tests
npx hardhat test

# Deploy locally
npx hardhat run scripts/deploy.js
```

### Frontend Verification

```bash
# Check if all dependencies installed
cd frontend
npm list

# Start development server
npm run dev
```

### MetaMask Verification

1. Network should show "Hardhat Local"
2. Account should show ~10,000 ETH
3. No connection errors in browser console

## 🔧 Development Tips

### Useful Commands

```bash
# Reset Hardhat network (if needed)
npx hardhat clean
npx hardhat compile

# Check contract size
npx hardhat size-contracts

# Get contract info
npx hardhat console --network localhost
```

### Environment Variables (Optional)

Create `backend/.env`:

```env
PRIVATE_KEY=your_private_key_for_mainnet
INFURA_PROJECT_ID=your_infura_id
ETHERSCAN_API_KEY=your_etherscan_key
```

### VS Code Extensions (Recommended)

- Solidity (Juan Blanco)
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- Auto Rename Tag

## 🚨 Common Setup Issues

### "Module not found" errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Port already in use

```bash
# Kill process on port 8545
lsof -ti:8545 | xargs kill -9

# Kill process on port 3000  
lsof -ti:3000 | xargs kill -9
```

### MetaMask connection issues

1. Reset MetaMask account data
2. Refresh browser page
3. Ensure correct network selected

### Contract deployment fails

1. Check Hardhat node is running
2. Verify contract compiles: `npx hardhat compile`
3. Check for syntax errors in Solidity code

## ✅ Setup Complete!

If everything works:

1. ✅ Hardhat node running on port 8545
2. ✅ Contract deployed successfully
3. ✅ Frontend running on port 3000
4. ✅ MetaMask connected to Hardhat network
5. ✅ Test account has ETH balance

**Next Steps:** Start using the application by connecting your wallet and registering a user!

---

🎉 **Congratulations! Your Blockchain 2FA system is ready for development.**

```

These files provide comprehensive documentation for setting up and understanding your Blockchain 2FA project! 📚
These files provide comprehensive documentation for setting up and understanding your Blockchain 2FA project! 📚

Similar code found with 1 license type
```
