import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  useToast,
  Alert,
  AlertIcon,
  Spinner,
  Badge,
  HStack
} from '@chakra-ui/react';
import { ethers } from 'ethers';
import { getContract } from '../utils/contract';
import { generateKeyPair, generateOTPSeed } from '../utils/web3';

const UserRegistration = ({ walletInfo, onRegistrationSuccess }) => {
  const [username, setUsername] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isCheckingRegistration, setIsCheckingRegistration] = useState(false);
  const [userExists, setUserExists] = useState(false);
  const [existingUser, setExistingUser] = useState(null);
  const [hasChecked, setHasChecked] = useState(false); // Add this to prevent re-checking
  const toast = useToast();

  // Memoize the check function to prevent unnecessary re-renders
  const checkExistingRegistration = useCallback(async () => {
    if (!walletInfo || hasChecked) return;
    
    setIsCheckingRegistration(true);
    try {
      const contract = getContract(walletInfo.provider);
      const [retrievedUsername, retrievedPublicKey, retrievedOtpSeed] = await contract.getUserDetails(walletInfo.address);
      
      if (retrievedUsername && retrievedUsername !== '') {
        setUserExists(true);
        setExistingUser({
          username: retrievedUsername,
          publicKey: retrievedPublicKey,
          address: walletInfo.address
        });
        
        // Also call the parent callback if user exists
        if (onRegistrationSuccess) {
          onRegistrationSuccess({
            username: retrievedUsername,
            publicKey: retrievedPublicKey,
            address: walletInfo.address
          });
        }
      } else {
        setUserExists(false);
        setExistingUser(null);
      }
    } catch (error) {
      console.log('User not registered yet');
      setUserExists(false);
      setExistingUser(null);
    } finally {
      setIsCheckingRegistration(false);
      setHasChecked(true); // Mark as checked
    }
  }, [walletInfo, hasChecked, onRegistrationSuccess]);

  // Run check only once when wallet info changes
  useEffect(() => {
    if (walletInfo && !hasChecked) {
      checkExistingRegistration();
    }
  }, [walletInfo, checkExistingRegistration, hasChecked]);

  // Reset check status when wallet changes
  useEffect(() => {
    if (walletInfo) {
      setHasChecked(false);
    }
  }, [walletInfo?.address]); // Only depend on address change

  const handleRegister = async () => {
    if (!username.trim()) {
      toast({
        title: "Error",
        description: "Please enter a username",
        status: "error",
        duration: 3000,
      });
      return;
    }

    if (username.length < 3) {
      toast({
        title: "Error",
        description: "Username must be at least 3 characters",
        status: "error",
        duration: 3000,
      });
      return;
    }

    setIsRegistering(true);
    try {
      // Generate key pair for this user
      const keyPair = generateKeyPair();
      console.log('Generated key pair:', {
        publicKey: keyPair.publicKey,
        address: keyPair.address
      });

      // Generate OTP seed
      const otpSeed = generateOTPSeed(username, walletInfo.address);
      console.log('Generated OTP seed:', otpSeed);

      // Convert public key to bytes
      const publicKeyBytes = keyPair.publicKey;

      // Get contract with signer
      const contract = getContract(walletInfo.signer);

      console.log('Registering user with:', {
        username,
        publicKeyLength: publicKeyBytes.length,
        publicKey: publicKeyBytes.substring(0, 20) + '...',
        otpSeed
      });

      // Call smart contract
      const tx = await contract.registerUser(username, publicKeyBytes, otpSeed);
      
      toast({
        title: "Transaction Submitted",
        description: "Waiting for confirmation...",
        status: "info",
        duration: 3000,
      });

      const receipt = await tx.wait();
      console.log('Registration transaction receipt:', receipt);

      // Store user data for future use
      const userData = {
        username,
        publicKey: publicKeyBytes,
        privateKey: keyPair.privateKey,
        otpSeed,
        address: walletInfo.address,
        registrationTx: receipt.transactionHash
      };

      // Store in localStorage for this demo
      localStorage.setItem(`user_${walletInfo.address}`, JSON.stringify(userData));

      toast({
        title: "Registration Successful!",
        description: `User ${username} registered successfully`,
        status: "success",
        duration: 5000,
      });

      // Update parent component
      if (onRegistrationSuccess) {
        onRegistrationSuccess(userData);
      }
      
      // Update local state
      setUserExists(true);
      setExistingUser({
        username,
        publicKey: publicKeyBytes,
        address: walletInfo.address
      });

    } catch (error) {
      console.error('Registration failed:', error);
      
      let errorMessage = 'Registration failed';
      if (error.reason) {
        errorMessage = error.reason;
      } else if (error.message.includes('User already registered')) {
        errorMessage = 'User already registered';
      } else if (error.message.includes('user rejected')) {
        errorMessage = 'Transaction rejected by user';
      }

      toast({
        title: "Registration Failed",
        description: errorMessage,
        status: "error",
        duration: 5000,
      });
    } finally {
      setIsRegistering(false);
    }
  };

  if (isCheckingRegistration) {
    return (
      <Box p={6} borderWidth={1} borderRadius="lg" textAlign="center">
        <VStack spacing={4}>
          <Spinner size="lg" color="blue.500" />
          <Text>Checking registration status...</Text>
        </VStack>
      </Box>
    );
  }

  if (userExists && existingUser) {
    return (
      <Box p={6} borderWidth={1} borderRadius="lg" bg="green.50">
        <VStack spacing={4} align="start">
          <HStack>
            <Badge colorScheme="green">Registered</Badge>
            <Text fontWeight="bold">User Already Registered</Text>
          </HStack>
          <VStack spacing={2} align="start">
            <Text fontSize="sm">
              <strong>Username:</strong> {existingUser.username}
            </Text>
            <Text fontSize="sm">
              <strong>Address:</strong> {existingUser.address.slice(0, 6)}...{existingUser.address.slice(-4)}
            </Text>
            <Text fontSize="sm">
              <strong>Public Key:</strong> {existingUser.publicKey.slice(0, 20)}...
            </Text>
          </VStack>
          <Alert status="info" size="sm">
            <AlertIcon />
            You can now proceed to generate OTP and authenticate
          </Alert>
        </VStack>
      </Box>
    );
  }

  return (
    <Box p={6} borderWidth={1} borderRadius="lg">
      <VStack spacing={6}>
        <Text fontSize="lg" fontWeight="bold">Register New User</Text>
        
        <FormControl>
          <FormLabel>Username</FormLabel>
          <Input
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isRegistering}
          />
        </FormControl>

        <VStack spacing={3} fontSize="sm" color="gray.600">
          <Text textAlign="center">
            Registration will generate a unique key pair and register you on the blockchain
          </Text>
          <Text textAlign="center">
            <strong>Connected Address:</strong> {walletInfo?.address.slice(0, 6)}...{walletInfo?.address.slice(-4)}
          </Text>
        </VStack>

        <Button
          colorScheme="blue"
          size="lg"
          onClick={handleRegister}
          isLoading={isRegistering}
          loadingText="Registering..."
          disabled={!username.trim() || !walletInfo}
          w="full"
        >
          Register User
        </Button>

        <Alert status="info" size="sm">
          <AlertIcon />
          This will create a transaction on the blockchain. Make sure you have some ETH for gas fees.
        </Alert>
      </VStack>
    </Box>
  );
};

export default UserRegistration;