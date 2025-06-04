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
  Progress,
  useColorModeValue,
  Divider
} from '@chakra-ui/react';
import { getContract } from '../utils/contract';

const OTPGenerator = ({ walletInfo, userData }) => {
  const [currentOTP, setCurrentOTP] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [isExpired, setIsExpired] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState(null);
  const [isCheckingRegistration, setIsCheckingRegistration] = useState(false);

  const toast = useToast();
  const cardBg = useColorModeValue('gray.50', 'gray.700');

  // Check registration status on-chain
  const checkRegistrationStatus = async () => {
    if (!walletInfo) return;
    setIsCheckingRegistration(true);
    try {
      const contract = getContract(walletInfo.provider);
      const [username, publicKey, otpSeed] = await contract.getUserDetails(walletInfo.address);
      const isRegistered =
        username &&
        publicKey &&
        otpSeed !== '0x0000000000000000000000000000000000000000000000000000000000000000';
      setRegistrationStatus({ isRegistered, username, publicKey, otpSeed });
    } catch (error) {
      setRegistrationStatus({ isRegistered: false, error: error.reason || error.message });
    } finally {
      setIsCheckingRegistration(false);
    }
  };

  useEffect(() => {
    if (walletInfo && userData) {
      checkRegistrationStatus();
    }
  }, [walletInfo, userData]);

  // Timer for OTP expiration
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
      toast({ title: "Error", description: "Wallet not connected or user not registered", status: "error", duration: 3000 });
      return;
    }

    setIsGenerating(true);
    try {
      // Use signer so msg.sender is correct
      const contract = getContract(walletInfo.signer);
      let username, publicKey, otpSeed;
      try {
        [username, publicKey, otpSeed] = await contract.getUserDetails(walletInfo.address);
      } catch (regError) {
        throw new Error(`User not registered on blockchain: ${regError.reason || regError.message}`);
      }
      if (!username || !publicKey || otpSeed === '0x' + '0'.repeat(64)) {
        throw new Error('User not registered on blockchain: Incomplete data');
      }

      const otp = await contract.generateOTP();
      const formattedOTP = otp.toString().padStart(6, '0');
      setCurrentOTP(formattedOTP);
      setTimeRemaining(30);
      setIsExpired(false);

      toast({ title: "OTP Generated! 🎉", description: `Your OTP: ${formattedOTP} (valid for 30s)`, status: "success", duration: 5000 });
    } catch (error) {
      toast({ title: "OTP Generation Failed ❌", description: error.message, status: "error", duration: 5000 });
      checkRegistrationStatus();
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (currentOTP) {
      navigator.clipboard.writeText(currentOTP);
      toast({ title: "Copied! 📋", description: "OTP copied to clipboard", status: "success", duration: 2000 });
    }
  };

  if (!userData) {
    return (
      <Box bg={cardBg} borderRadius="xl" p={6}>
        <Alert status="info" borderRadius="lg">
          <AlertIcon />
          Please register first to generate OTP
        </Alert>
      </Box>
    );
  }

  return (
    <Box bg={cardBg} borderRadius="xl" p={6}>
      <VStack spacing={6}>
        <VStack spacing={2} textAlign="center">
          <Text fontSize="xl" fontWeight="bold">Generate OTP</Text>
          <Text fontSize="md" color="gray.600">Generate a time-based one-time password</Text>
        </VStack>

        {/* Registration Status */}
        <Box w="full" p={4} borderWidth={1} borderRadius="lg" bg={registrationStatus?.isRegistered ? "green.50" : "red.50"}>
          <VStack spacing={2} align="stretch">
            <HStack justify="space-between">
              <Text fontSize="sm" fontWeight="bold">Blockchain Registration</Text>
              <Button size="xs" variant="outline" onClick={checkRegistrationStatus} isLoading={isCheckingRegistration} loadingText="Checking...">🔄 Re-check</Button>
            </HStack>
            {registrationStatus ? (
              registrationStatus.isRegistered ? (
                <HStack><Badge colorScheme="green">✅ Registered</Badge><Text fontSize="xs">User: {registrationStatus.username}</Text></HStack>
              ) : (
                <VStack align="start" spacing={1}><Badge colorScheme="red">❌ Not Registered</Badge><Text fontSize="xs" color="red.600">{registrationStatus.error || "User not registered"}</Text></VStack>
              )
            ) : (
              <Text fontSize="xs" color="gray.600">Click "Re-check" to verify</Text>
            )}
          </VStack>
        </Box>

        <Divider />

        {/* Frontend User Info */}
        <Box p={4} borderWidth={1} borderRadius="md" bg="blue.50" w="full">
          <VStack spacing={2} align="start">
            <Text fontSize="sm" fontWeight="bold">Frontend User Data:</Text>
            <Text fontSize="xs">Username: {userData.username}</Text>
            <Text fontSize="xs">Address: {walletInfo.address?.slice(0, 8)}...{walletInfo.address?.slice(-6)}</Text>
          </VStack>
        </Box>

        {/* OTP Display */}
        {currentOTP && (
          <Box p={6} borderWidth={2} borderRadius="lg" bg={isExpired ? "red.50" : "green.50"} w="full" textAlign="center">
            <VStack spacing={4}>
              <HStack><Badge colorScheme={isExpired ? "red" : "green"}>{isExpired ? "Expired" : "Active"}</Badge><Text fontWeight="bold">Your OTP</Text></HStack>
              <Code fontSize="2xl" p={4} borderRadius="md" bg="white">{currentOTP}</Code>
              {!isExpired && (
                <VStack spacing={2} w="full">
                  <Text fontSize="sm" color="gray.600">Expires in {timeRemaining}s</Text>
                  <Progress value={(timeRemaining / 30) * 100} colorScheme={timeRemaining > 10 ? "green" : "red"} size="sm" w="full"/>
                </VStack>
              )}
              <Button size="sm" variant="outline" onClick={copyToClipboard} disabled={isExpired}>📋 Copy OTP</Button>
            </VStack>
          </Box>
        )}

        <Button colorScheme="blue" size="lg" onClick={generateOTP} isLoading={isGenerating} loadingText="Generating..." w="full" leftIcon={<span>🔑</span>} borderRadius="lg" disabled={registrationStatus && !registrationStatus.isRegistered}>
          {currentOTP ? 'Generate New OTP' : 'Generate OTP'}
        </Button>

        <Alert status={registrationStatus?.isRegistered ? "success" : "warning"} size="sm" borderRadius="lg">
          <AlertIcon />
          {registrationStatus?.isRegistered ? "✅ Ready to generate OTP" : "⚠️ Please register first"}
        </Alert>
      </VStack>
    </Box>
  );
};

export default OTPGenerator;