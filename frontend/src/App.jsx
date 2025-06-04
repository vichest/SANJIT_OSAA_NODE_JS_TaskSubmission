import React, { useState, useCallback } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Badge,
  Divider
} from '@chakra-ui/react';
import WalletConnect from './components/WalletConnect';
import UserRegistration from './components/UserRegistration';
import OTPGenerator from './components/OTPGenerator';
import Authentication from './components/Authentication';

function App() {
  const [walletInfo, setWalletInfo] = useState(null);
  const [userData, setUserData] = useState(null);

  const handleWalletConnected = useCallback((wallet) => {
    setWalletInfo(wallet);
    console.log('Wallet connected:', wallet);
  }, []);

  const handleRegistrationSuccess = useCallback((user) => {
    setUserData(user);
    console.log('User registered:', user);
  }, []);

  return (
    <Box minH="100vh" bg="gray.50">
      <Container maxW="container.md" py={8}>
        <VStack spacing={8}>
          {/* Header */}
          <VStack spacing={4} textAlign="center">
            <Heading as="h1" size="2xl" color="blue.500">
              🔐 Blockchain 2FA
            </Heading>
            <Text fontSize="lg" color="gray.600">
              Secure Two-Factor Authentication on the Blockchain
            </Text>
            <Badge colorScheme="green" px={3} py={1} borderRadius="full">
              ✅ Smart Contract Ready
            </Badge>
          </VStack>

          <Divider />

          {/* Step 1: Wallet Connection */}
          <VStack spacing={6} w="full">
            <Heading as="h2" size="lg">
              Step 1: Connect Wallet
            </Heading>
            <WalletConnect onWalletConnected={handleWalletConnected} />
          </VStack>

          {/* Step 2: User Registration */}
          {walletInfo && (
            <>
              <Divider />
              <VStack spacing={6} w="full">
                <Heading as="h2" size="lg">
                  Step 2: Register User
                </Heading>
                <UserRegistration 
                  walletInfo={walletInfo} 
                  onRegistrationSuccess={handleRegistrationSuccess}
                />
              </VStack>
            </>
          )}

          {/* Step 3: OTP Generation */}
          {walletInfo && userData && (
            <>
              <Divider />
              <VStack spacing={6} w="full">
                <Heading as="h2" size="lg">
                  Step 3: Generate OTP
                </Heading>
                <OTPGenerator 
                  walletInfo={walletInfo} 
                  userData={userData}
                />
              </VStack>
            </>
          )}

          {/* Step 4: Authentication */}
          {walletInfo && userData && (
            <>
              <Divider />
              <VStack spacing={6} w="full">
                <Heading as="h2" size="lg">
                  Step 4: Authenticate
                </Heading>
                <Authentication 
                  walletInfo={walletInfo} 
                  userData={userData}
                />
              </VStack>
            </>
          )}
        </VStack>
      </Container>
    </Box>
  );
}

export default App;