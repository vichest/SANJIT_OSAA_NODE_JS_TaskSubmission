import { ethers } from 'ethers';

export const connectWallet = async () => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Create provider and signer
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      
      console.log('Wallet connected:', address);
      
      return {
        provider,
        signer,
        address
      };
    } catch (error) {
      console.error('Wallet connection failed:', error);
      throw error;
    }
  } else {
    throw new Error('MetaMask not installed');
  }
};

export const switchToSepoliaNetwork = async () => {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0xaa36a7' }], // 11155111 in hex (Sepolia)
    });
  } catch (switchError) {
    // If network doesn't exist, add it
    if (switchError.code === 4902) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0xaa36a7", // 11155111 in hex
            chainName: "Sepolia Test Network",
            rpcUrls: [
              "https://eth-sepolia.g.alchemy.com/v2/tbG-68_qjk99I8BdZc7uv-ZV87gVlpvp",
            ],
            nativeCurrency: {
              name: "SepoliaETH",
              symbol: "ETH",
              decimals: 18,
            },
            blockExplorerUrls: ["https://sepolia.etherscan.io/"],
          },
        ],
      });
    } else {
      throw switchError;
    }
  }
};

export const generateKeyPair = () => {
  // Generate a random wallet
  const wallet = ethers.Wallet.createRandom();
  
  return {
    privateKey: wallet.privateKey,
    publicKey: wallet.publicKey,
    address: wallet.address
  };
};

export const generateOTPSeed = (username, address) => {
  // Generate a deterministic seed based on username and address
  const combinedString = `${username}-${address}-${Date.now()}`;
  return ethers.utils.id(combinedString);
};

// Network configuration
export const SEPOLIA_CONFIG = {
  chainId: 11155111,
  chainName: 'Sepolia Test Network',
  rpcUrl: 'https://rpc.sepolia.org',
  blockExplorer: 'https://sepolia.etherscan.io/'
};

// Helper function to get current network
export const getCurrentNetwork = async () => {
  if (typeof window.ethereum !== 'undefined') {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const network = await provider.getNetwork();
    return network;
  }
  return null;
};

// Helper function to check if on Sepolia
export const isOnSepolia = async () => {
  const network = await getCurrentNetwork();
  return network && network.chainId === 11155111;
};