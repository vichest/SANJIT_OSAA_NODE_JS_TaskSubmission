import { ethers } from 'ethers';

// Replace with your actual deployed contract address
export const CONTRACT_ADDRESS = "0x8dBf5245AB11A1D74d4F0B47dC49DbA3F7BAB6fe"; 

export const CONTRACT_ABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "otp",
        "type": "uint256"
      }
    ],
    "name": "OtpGenerated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "success",
        "type": "bool"
      }
    ],
    "name": "UserAuthenticated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "username",
        "type": "string"
      }
    ],
    "name": "UserRegistered",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "bytes",
        "name": "_publicKey",
        "type": "bytes"
      },
      {
        "internalType": "uint256",
        "name": "_otp",
        "type": "uint256"
      }
    ],
    "name": "authenticateUser",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "generateOTP",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "userAddress",
        "type": "address"
      }
    ],
    "name": "getUserDetails",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "internalType": "bytes",
        "name": "",
        "type": "bytes"
      },
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes",
        "name": "_publicKey",
        "type": "bytes"
      },
      {
        "internalType": "uint256",
        "name": "_otp",
        "type": "uint256"
      }
    ],
    "name": "isOTPValid",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_username",
        "type": "string"
      },
      {
        "internalType": "bytes",
        "name": "_publicKey",
        "type": "bytes"
      },
      {
        "internalType": "bytes32",
        "name": "_otpSeed",
        "type": "bytes32"
      }
    ],
    "name": "registerUser",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export const NETWORK_CONFIG = {
  chainId: 11155111,
  chainName: "Sepolia Testnet",
  rpcUrl:
    "https://eth-sepolia.g.alchemy.com/v2/tbG-68_qjk99I8BdZc7uv-ZV87gVlpvp",
};

// Contract instance helper
export const getContract = (signerOrProvider) => {
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signerOrProvider);
};