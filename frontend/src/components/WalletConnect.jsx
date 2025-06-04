import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import {
  Box,
  Button,
  Text,
  VStack,
  HStack,
  Badge,
  useToast,
  Alert,
  AlertIcon,
  useColorModeValue,
  Flex,
  Icon
} from '@chakra-ui/react';
import { FaEthereum, FaCheckCircle } from 'react-icons/fa';
import { connectWallet, switchToSepoliaNetwork } from '../utils/web3';

const WalletConnect = ({ onWalletConnected }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletInfo, setWalletInfo] = useState(null);
  const toast = useToast();

  const cardBg = useColorModeValue('gray.50', 'gray.700');
  const successBg = useColorModeValue('green.50', 'green.900');

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const { provider, signer, address } = await connectWallet();
      await switchToSepoliaNetwork();
      
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
        title: "🎉 Wallet Connected!",
        description: `Successfully connected to Sepolia testnet: ${address.slice(0, 6)}...${address.slice(-4)}`,
        status: "success",
        duration: 4000,
      });
      
    } catch (error) {
      console.error('Connection failed:', error);
      toast({
        title: "❌ Connection Failed",
        description: error.message,
        status: "error",
        duration: 5000,
      });
    } finally {
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            const { provider, signer, address } = await connectWallet();
            
            // Check if on Sepolia
            const network = await provider.getNetwork();
            if (network.chainId !== 11155111) {
              toast({
                title: "Wrong Network",
                description: "Please switch to Sepolia testnet",
                status: "warning",
                duration: 5000,
              });
              return;
            }
            
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
  }, [onWalletConnected, toast]);

  if (walletInfo) {
    return (
      <Box bg={successBg} borderRadius="xl" p={6} border="2px" borderColor="green.200">
        <VStack spacing={4}>
          <HStack spacing={3}>
            <Flex
              w={10}
              h={10}
              borderRadius="xl"
              bg="green.500"
              align="center"
              justify="center"
              color="white"
            >
              <Icon as={FaCheckCircle} />
            </Flex>
            <VStack align="start" spacing={1}>
              <Text fontWeight="bold" fontSize="lg" color="green.700">
                Connected to Sepolia
              </Text>
              <Badge colorScheme="green" borderRadius="full">
                Testnet Ready
              </Badge>
            </VStack>
          </HStack>
          
          <Box w="full" bg="white" borderRadius="lg" p={4}>
            <VStack spacing={2} align="start">
              <HStack justify="space-between" w="full">
                <Text fontSize="sm" fontWeight="medium" color="gray.600">
                  Address:
                </Text>
                <Text fontSize="sm" fontFamily="mono" color="gray.800">
                  {walletInfo.address.slice(0, 8)}...{walletInfo.address.slice(-6)}
                </Text>
              </HStack>
              <HStack justify="space-between" w="full">
                <Text fontSize="sm" fontWeight="medium" color="gray.600">
                  Balance:
                </Text>
                <HStack spacing={1}>
                  <Icon as={FaEthereum} color="gray.600" />
                  <Text fontSize="sm" fontWeight="bold" color="gray.800">
                    {walletInfo.balance} ETH
                  </Text>
                </HStack>
              </HStack>
              <HStack justify="space-between" w="full">
                <Text fontSize="sm" fontWeight="medium" color="gray.600">
                  Network:
                </Text>
                <Badge colorScheme="blue" size="sm">
                  Sepolia Testnet
                </Badge>
              </HStack>
            </VStack>
          </Box>

          {/* Get Sepolia ETH Link */}
          <Box w="full" bg="blue.50" borderRadius="lg" p={3}>
            <VStack spacing={2}>
              <Text fontSize="sm" fontWeight="medium" color="blue.700">
                Need Sepolia ETH?
              </Text>
              <Button
                as="a"
                href="https://sepoliafaucet.com/"
                target="_blank"
                size="sm"
                colorScheme="blue"
                variant="outline"
              >
                Get Free Testnet ETH
              </Button>
            </VStack>
          </Box>
        </VStack>
      </Box>
    );
  }

  return (
    <Box bg={cardBg} borderRadius="xl" p={8}>
      <VStack spacing={6}>
        <VStack spacing={3} textAlign="center">
          <Text fontSize="xl" fontWeight="bold" color="gray.700">
            Connect to Sepolia Testnet
          </Text>
          <Text fontSize="md" color="gray.600" lineHeight="tall">
            Connect your MetaMask wallet to Sepolia testnet to start using blockchain 2FA
          </Text>
        </VStack>
        
        {typeof window.ethereum === 'undefined' ? (
          <Alert status="warning" borderRadius="lg">
            <AlertIcon />
            <VStack align="start" spacing={1}>
              <Text fontWeight="medium">MetaMask Required</Text>
              <Text fontSize="sm">Please install MetaMask to continue</Text>
            </VStack>
          </Alert>
        ) : (
          <VStack spacing={4}>
            <Button
              colorScheme="blue"
              size="lg"
              onClick={handleConnect}
              isLoading={isConnecting}
              loadingText="Connecting..."
              leftIcon={<span style={{ fontSize: '20px' }}>🦊</span>}
              borderRadius="xl"
              px={8}
              py={6}
              fontSize="lg"
              fontWeight="bold"
              _hover={{
                transform: 'translateY(-2px)',
                shadow: 'lg'
              }}
              transition="all 0.2s"
            >
              Connect to Sepolia
            </Button>
            
            <Alert status="info" borderRadius="lg" size="sm">
              <AlertIcon />
              <Text fontSize="sm">
                This will automatically add/switch to Sepolia testnet
              </Text>
            </Alert>
          </VStack>
        )}
      </VStack>
    </Box>
  );
};

export default WalletConnect;