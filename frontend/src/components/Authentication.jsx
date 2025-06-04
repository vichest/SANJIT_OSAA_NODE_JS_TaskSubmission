import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  HStack,
  Text,
  useToast,
  Alert,
  AlertIcon,
  Badge,
  Divider,
  useColorModeValue
} from '@chakra-ui/react';
import { getContract } from '../utils/contract';

const Authentication = ({ walletInfo, userData }) => {
  const [otpInput, setOtpInput] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [lastAuthResult, setLastAuthResult] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);

  const toast = useToast();
  const cardBg = useColorModeValue('gray.50', 'gray.700');

  const validateOTP = async () => {
    if (!otpInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter an OTP",
        status: "error",
        duration: 3000,
      });
      return;
    }

    if (otpInput.length !== 6) {
      toast({
        title: "Error",
        description: "OTP must be 6 digits",
        status: "error",
        duration: 3000,
      });
      return;
    }

    setIsValidating(true);
    try {
      const contract = getContract(walletInfo.provider);
      
      // Get user's public key from stored data or contract
      let publicKey = userData.publicKey;
      if (!publicKey) {
        console.log('No stored public key, fetching from contract...');
        const [, retrievedPublicKey] = await contract.getUserDetails(walletInfo.address);
        publicKey = retrievedPublicKey;
      }

      console.log('=== OTP VALIDATION DEBUG ===');
      console.log('Input OTP:', otpInput);
      console.log('Input OTP as number:', parseInt(otpInput));
      console.log('Public Key:', publicKey.substring(0, 20) + '...');
      console.log('Contract address:', contract.address);
      console.log('User address:', walletInfo.address);

      // First, let's generate a fresh OTP to compare
      const freshOTP = await contract.generateOTP();
      console.log('Fresh OTP from contract:', freshOTP.toString());
      console.log('Fresh OTP formatted:', freshOTP.toString().padStart(6, '0'));

      // Store debug info
      setDebugInfo({
        inputOTP: otpInput,
        freshOTP: freshOTP.toString().padStart(6, '0'),
        publicKey: publicKey.substring(0, 20) + '...',
        timestamp: new Date().toISOString()
      });

      // Validate OTP without creating a transaction
      const isValid = await contract.isOTPValid(publicKey, parseInt(otpInput));
      console.log('OTP validation result:', isValid);
      
      if (isValid) {
        toast({
          title: "OTP Valid ✅",
          description: "This OTP is currently valid",
          status: "success",
          duration: 3000,
        });
      } else {
        toast({
          title: "OTP Invalid ❌",
          description: `OTP ${otpInput} is invalid or expired. Try generating a new one.`,
          status: "error",
          duration: 5000,
        });
      }

    } catch (error) {
      console.error('OTP validation failed:', error);
      toast({
        title: "Validation Failed",
        description: error.reason || error.message,
        status: "error",
        duration: 5000,
      });
    } finally {
      setIsValidating(false);
    }
  };

  const authenticateUser = async () => {
    if (!otpInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter an OTP",
        status: "error",
        duration: 3000,
      });
      return;
    }

    if (otpInput.length !== 6) {
      toast({
        title: "Error",
        description: "OTP must be 6 digits",
        status: "error",
        duration: 3000,
      });
      return;
    }

    setIsAuthenticating(true);
    try {
      const contract = getContract(walletInfo.signer);
      
      let publicKey = userData.publicKey;
      if (!publicKey) {
        const [, retrievedPublicKey] = await contract.getUserDetails(walletInfo.address);
        publicKey = retrievedPublicKey;
      }

      console.log('=== AUTHENTICATION DEBUG ===');
      console.log('Authenticating with OTP:', otpInput);
      console.log('Public Key:', publicKey.substring(0, 20) + '...');
      console.log('Address:', walletInfo.address);

      const tx = await contract.authenticateUser(publicKey, parseInt(otpInput));
      
      toast({
        title: "Transaction Submitted",
        description: "Waiting for authentication confirmation...",
        status: "info",
        duration: 3000,
      });

      const receipt = await tx.wait();
      console.log('Authentication transaction receipt:', receipt);

      const authEvent = receipt.events?.find(event => event.event === 'UserAuthenticated');
      const success = authEvent?.args?.success || false;

      const result = {
        success,
        transactionHash: receipt.transactionHash,
        timestamp: new Date().toISOString(),
        otp: otpInput
      };

      setLastAuthResult(result);

      if (success) {
        toast({
          title: "Authentication Successful! 🎉",
          description: "You have been successfully authenticated",
          status: "success",
          duration: 5000,
        });
      } else {
        toast({
          title: "Authentication Failed ❌",
          description: "OTP was invalid or expired",
          status: "error",
          duration: 5000,
        });
      }

      setOtpInput('');

    } catch (error) {
      console.error('Authentication failed:', error);
      
      let errorMessage = 'Authentication failed';
      if (error.reason) {
        errorMessage = error.reason;
      } else if (error.message.includes('user rejected')) {
        errorMessage = 'Transaction rejected by user';
      }

      toast({
        title: "Authentication Failed",
        description: errorMessage,
        status: "error",
        duration: 5000,
      });
    } finally {
      setIsAuthenticating(false);
    }
  };

  if (!userData) {
    return (
      <Box bg={cardBg} borderRadius="xl" p={6}>
        <Alert status="info" borderRadius="lg">
          <AlertIcon />
          Please register and generate an OTP first
        </Alert>
      </Box>
    );
  }

  return (
    <Box bg={cardBg} borderRadius="xl" p={6}>
      <VStack spacing={6}>
        <VStack spacing={2} textAlign="center">
          <Text fontSize="xl" fontWeight="bold">Authenticate with OTP</Text>
          <Text fontSize="md" color="gray.600">
            Enter your generated OTP to authenticate
          </Text>
        </VStack>

        {/* Debug Info */}
        {debugInfo && (
          <Box p={4} borderWidth={1} borderRadius="md" bg="yellow.50" w="full">
            <VStack spacing={2} align="start">
              <Text fontSize="sm" fontWeight="bold">🔍 Debug Info</Text>
              <Text fontSize="xs">Input OTP: {debugInfo.inputOTP}</Text>
              <Text fontSize="xs">Fresh OTP: {debugInfo.freshOTP}</Text>
              <Text fontSize="xs">Public Key: {debugInfo.publicKey}</Text>
              <Text fontSize="xs">Time: {new Date(debugInfo.timestamp).toLocaleTimeString()}</Text>
            </VStack>
          </Box>
        )}

        {/* Last Authentication Result */}
        {lastAuthResult && (
          <Box p={4} borderWidth={1} borderRadius="md" bg={lastAuthResult.success ? "green.50" : "red.50"} w="full">
            <VStack spacing={2} align="start">
              <HStack>
                <Badge colorScheme={lastAuthResult.success ? "green" : "red"}>
                  {lastAuthResult.success ? "Success" : "Failed"}
                </Badge>
                <Text fontSize="sm" fontWeight="bold">Last Authentication</Text>
              </HStack>
              <Text fontSize="sm">
                <strong>Time:</strong> {new Date(lastAuthResult.timestamp).toLocaleString()}
              </Text>
              <Text fontSize="sm">
                <strong>TX Hash:</strong> {lastAuthResult.transactionHash.slice(0, 10)}...
              </Text>
            </VStack>
          </Box>
        )}

        <Divider />

        {/* OTP Input */}
        <FormControl>
          <FormLabel fontWeight="bold">One-Time Password</FormLabel>
          <Input
            placeholder="Enter 6-digit OTP"
            value={otpInput}
            onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
            disabled={isAuthenticating || isValidating}
            textAlign="center"
            fontSize="xl"
            letterSpacing="wide"
            borderRadius="lg"
            h={12}
          />
        </FormControl>

        {/* Action Buttons */}
        <VStack spacing={3} w="full">
          <Button
            variant="outline"
            size="lg"
            onClick={validateOTP}
            isLoading={isValidating}
            loadingText="Validating..."
            disabled={!otpInput.trim() || otpInput.length !== 6}
            w="full"
            borderRadius="lg"
          >
            🔍 Validate OTP (Debug Mode)
          </Button>

          <Button
            colorScheme="green"
            size="lg"
            onClick={authenticateUser}
            isLoading={isAuthenticating}
            loadingText="Authenticating..."
            disabled={!otpInput.trim() || otpInput.length !== 6}
            w="full"
            leftIcon={<span>🔐</span>}
            borderRadius="lg"
          >
            Authenticate (Create Transaction)
          </Button>
        </VStack>

        {/* Info Alert */}
        <Alert status="info" size="sm" borderRadius="lg">
          <AlertIcon />
          Try "Validate OTP" first to debug. Make sure to use the OTP immediately after generation.
        </Alert>
      </VStack>
    </Box>
  );
};

export default Authentication;