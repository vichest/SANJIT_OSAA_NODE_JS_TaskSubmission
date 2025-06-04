import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  useToast,
  Badge,
  Alert,
  AlertIcon,
  Code,
  Progress
} from '@chakra-ui/react';
import { getContract } from '../utils/contract';

const OTPGenerator = ({ walletInfo, userData }) => {
  const [currentOTP, setCurrentOTP] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [isExpired, setIsExpired] = useState(false);
  const toast = useToast();

  // Auto-refresh timer for OTP expiration
  useEffect(() => {
    if (currentOTP && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsExpired(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentOTP, timeRemaining]);

  const generateOTP = async () => {
    if (!walletInfo || !userData) {
      toast({
        title: "Error",
        description: "Wallet not connected or user not registered",
        status: "error",
        duration: 3000,
      });
      return;
    }

    setIsGenerating(true);
    try {
      const contract = getContract(walletInfo.provider);
      
      // Generate OTP from smart contract
      const otp = await contract.generateOTP();
      const otpString = otp.toString();
      
      // Ensure OTP is 6 digits (pad with zeros if needed)
      const formattedOTP = otpString.padStart(6, '0');
      
      setCurrentOTP(formattedOTP);
      setTimeRemaining(30); // Reset timer
      setIsExpired(false);
      
      toast({
        title: "OTP Generated!",
        description: "Your OTP is valid for 30 seconds",
        status: "success",
        duration: 3000,
      });

      console.log('Generated OTP:', formattedOTP);
      
    } catch (error) {
      console.error('OTP generation failed:', error);
      
      let errorMessage = 'Failed to generate OTP';
      if (error.reason) {
        errorMessage = error.reason;
      } else if (error.message.includes('User not registered')) {
        errorMessage = 'User not registered. Please register first.';
      }

      toast({
        title: "OTP Generation Failed",
        description: errorMessage,
        status: "error",
        duration: 5000,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (currentOTP) {
      navigator.clipboard.writeText(currentOTP);
      toast({
        title: "Copied!",
        description: "OTP copied to clipboard",
        status: "success",
        duration: 2000,
      });
    }
  };

  if (!userData) {
    return (
      <Box p={6} borderWidth={1} borderRadius="lg" bg="gray.50">
        <Alert status="info">
          <AlertIcon />
          Please register first to generate OTP
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={6} borderWidth={1} borderRadius="lg">
      <VStack spacing={6}>
        <VStack spacing={2} textAlign="center">
          <Text fontSize="lg" fontWeight="bold">Generate OTP</Text>
          <Text fontSize="sm" color="gray.600">
            Generate a time-based one-time password for authentication
          </Text>
        </VStack>

        {/* User Info */}
        <Box p={4} borderWidth={1} borderRadius="md" bg="blue.50" w="full">
          <VStack spacing={2} align="start">
            <Text fontSize="sm">
              <strong>Username:</strong> {userData.username}
            </Text>
            <Text fontSize="sm">
              <strong>Address:</strong> {userData.address?.slice(0, 6)}...{userData.address?.slice(-4)}
            </Text>
          </VStack>
        </Box>

        {/* OTP Display */}
        {currentOTP && (
          <Box p={6} borderWidth={2} borderRadius="lg" bg={isExpired ? "red.50" : "green.50"} w="full" textAlign="center">
            <VStack spacing={4}>
              <HStack>
                <Badge colorScheme={isExpired ? "red" : "green"}>
                  {isExpired ? "Expired" : "Active"}
                </Badge>
                <Text fontWeight="bold">Your OTP</Text>
              </HStack>
              
              <Code fontSize="2xl" p={4} borderRadius="md" bg="white">
                {currentOTP}
              </Code>
              
              {!isExpired && (
                <VStack spacing={2} w="full">
                  <Text fontSize="sm" color="gray.600">
                    Expires in {timeRemaining} seconds
                  </Text>
                  <Progress 
                    value={(timeRemaining / 30) * 100} 
                    colorScheme={timeRemaining > 10 ? "green" : "red"}
                    size="sm"
                    w="full"
                  />
                </VStack>
              )}

              <Button
                size="sm"
                variant="outline"
                onClick={copyToClipboard}
                disabled={isExpired}
              >
                📋 Copy OTP
              </Button>
            </VStack>
          </Box>
        )}

        {/* Generate Button */}
        <Button
          colorScheme="blue"
          size="lg"
          onClick={generateOTP}
          isLoading={isGenerating}
          loadingText="Generating..."
          w="full"
          leftIcon={<span>🔑</span>}
        >
          {currentOTP ? 'Generate New OTP' : 'Generate OTP'}
        </Button>

        {/* Info Alert */}
        <Alert status="info" size="sm">
          <AlertIcon />
          OTPs are valid for 30 seconds and are generated using blockchain data
        </Alert>
      </VStack>
    </Box>
  );
};

export default OTPGenerator;