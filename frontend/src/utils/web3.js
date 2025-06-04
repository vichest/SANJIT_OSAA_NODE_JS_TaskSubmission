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
      
      return { provider, signer, address };
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw new Error('Failed to connect wallet');
    }
  } else {
    throw new Error('MetaMask not installed');
  }
};

export const switchToLocalNetwork = async () => {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x539' }], // 1337 in hex
    });
  } catch (switchError) {
    // If network doesn't exist, add it
    if (switchError.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0x539',
          chainName: 'Hardhat Local',
          rpcUrls: ['http://127.0.0.1:8545'],
          nativeCurrency: {
            name: 'ETH',
            symbol: 'ETH',
            decimals: 18
          }
        }]
      });
    }
  }
};

export const generateKeyPair = () => {
  const wallet = ethers.Wallet.createRandom();
  return {
    privateKey: wallet.privateKey,
    publicKey: wallet.publicKey,
    address: wallet.address
  };
};

export const generateOTPSeed = (username, address) => {
  return ethers.utils.id(`${username}-${address}-${Date.now()}`);
};