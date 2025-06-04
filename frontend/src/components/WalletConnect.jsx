import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers'; // Add this import!
import {
  Box,
  Button,
  Text,
  VStack,
  HStack,
  Badge,
  useToast,
  Alert,
  AlertIcon
} from '@chakra-ui/react';
import { connectWallet, switchToLocalNetwork } from '../utils/web3';

const WalletConnect = ({ onWalletConnected }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletInfo, setWalletInfo] = useState(null);
  const toast = useToast();

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      // First connect wallet
      const { provider, signer, address } = await connectWallet();
      
      // Then switch to local network
      await switchToLocalNetwork();
      
      // Get balance
      const balance = await provider.getBalance(address);
      const balanceInEth = parseFloat(ethers.utils.formatEther(balance)).toFixed(4);
      
      const wallet = {
        provider,
        signer,
        address,
        balance: balanceInEth
      };
      
      setWalletInfo(wallet);
      onWalletConnected(wallet);
      
      toast({
        title: "Wallet Connected!",
        description: `Connected to ${address.slice(0, 6)}...${address.slice(-4)}`,
        status: "success",
        duration: 3000,
      });
      
    } catch (error) {
      console.error('Connection failed:', error);
      toast({
        title: "Connection Failed",
        description: error.message,
        status: "error",
        duration: 5000,
      });
    } finally {
      setIsConnecting(false);
    }
  };

  // Check if already connected on component mount
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            const { provider, signer, address } = await connectWallet();
            const balance = await provider.getBalance(address);
            const balanceInEth = parseFloat(ethers.utils.formatEther(balance)).toFixed(4);
            
            const wallet = { provider, signer, address, balance: balanceInEth };
            setWalletInfo(wallet);
            onWalletConnected(wallet);
          }
        } catch (error) {
          console.log('No existing connection');
        }
      }
    };
    
    checkConnection();
  }, [onWalletConnected]);

  if (walletInfo) {
    return (
      <Box p={4} borderWidth={1} borderRadius="lg" bg="green.50">
        <VStack spacing={3} align="start">
          <HStack>
            <Badge colorScheme="green">Connected</Badge>
            <Text fontWeight="bold">Wallet Connected</Text>
          </HStack>
          <Text fontSize="sm">
            <strong>Address:</strong> {walletInfo.address.slice(0, 6)}...{walletInfo.address.slice(-4)}
          </Text>
          <Text fontSize="sm">
            <strong>Balance:</strong> {walletInfo.balance} ETH
          </Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box p={6} borderWidth={1} borderRadius="lg" textAlign="center">
      <VStack spacing={4}>
        <Text fontSize="lg" fontWeight="bold">Connect Your Wallet</Text>
        
        {typeof window.ethereum === 'undefined' ? (
          <Alert status="warning">
            <AlertIcon />
            Please install MetaMask to continue
          </Alert>
        ) : (
          <VStack spacing={3}>
            <Text fontSize="sm" color="gray.600">
              Connect your MetaMask wallet to interact with the blockchain
            </Text>
            <Button
              colorScheme="blue"
              size="lg"
              onClick={handleConnect}
              isLoading={isConnecting}
              loadingText="Connecting..."
              leftIcon={<span>🦊</span>}
            >
              Connect MetaMask
            </Button>
          </VStack>
        )}
      </VStack>
    </Box>
  );
};

export default WalletConnect;