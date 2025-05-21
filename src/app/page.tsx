'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  VStack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { nanoid } from 'nanoid';

export default function Home() {
  const router = useRouter();
  const toast = useToast();
  const [roomCode, setRoomCode] = useState('');

  const createNewGame = () => {
    const newRoomId = nanoid(6);
    router.push(`/game/${newRoomId}`);
  };

  const joinGame = () => {
    if (!roomCode) {
      toast({
        title: 'Error',
        description: 'Please enter a room code',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    router.push(`/game/${roomCode}`);
  };

  return (
    <Container maxW="container.sm" py={20}>
      <VStack spacing={8}>
        <Heading>Tic Tac Toe</Heading>
        <Text fontSize="xl" textAlign="center">
          Play Tic Tac Toe with your friends in real-time!
        </Text>

        <Box w="100%" p={8} borderWidth={1} borderRadius="lg">
          <VStack spacing={6}>
            <Button
              colorScheme="blue"
              size="lg"
              w="100%"
              onClick={createNewGame}
            >
              Create New Game
            </Button>

            <Text>or</Text>

            <FormControl>
              <FormLabel>Join Existing Game</FormLabel>
              <Input
                placeholder="Enter room code"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
              />
            </FormControl>

            <Button
              colorScheme="green"
              size="lg"
              w="100%"
              onClick={joinGame}
            >
              Join Game
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
}
