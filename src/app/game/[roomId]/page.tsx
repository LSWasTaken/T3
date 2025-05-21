'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Box, Container, Grid, Heading, Text } from '@chakra-ui/react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import GameBoard from '@/components/GameBoard';
import PlayerInfo from '@/components/PlayerInfo';

export default function GameRoom() {
  const params = useParams();
  const roomId = params.roomId as string;
  const [playerId, setPlayerId] = useState<string>('');
  const [gameData, setGameData] = useState<any>(null);

  useEffect(() => {
    const initializeGame = async () => {
      const gameRef = doc(db, 'rooms', roomId);
      const gameDoc = await getDoc(gameRef);

      if (!gameDoc.exists()) {
        // Create new game
        const newGameData = {
          players: ['player1'],
          board: Array(9).fill(''),
          turn: 'player1',
          status: 'waiting',
          winner: null,
        };
        await setDoc(gameRef, newGameData);
        setPlayerId('player1');
        setGameData(newGameData);
      } else {
        const data = gameDoc.data();
        if (data.players.length < 2) {
          // Join existing game
          const updatedData = {
            ...data,
            players: [...data.players, 'player2'],
            status: 'playing',
          };
          await setDoc(gameRef, updatedData);
          setPlayerId('player2');
          setGameData(updatedData);
        } else {
          // Game is full
          setGameData(data);
        }
      }
    };

    initializeGame();
  }, [roomId]);

  if (!gameData) {
    return (
      <Container centerContent py={10}>
        <Text>Loading game...</Text>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={10}>
      <Heading textAlign="center" mb={8}>
        Tic Tac Toe
      </Heading>
      <Grid templateColumns="1fr 2fr 1fr" gap={8} alignItems="center">
        <PlayerInfo
          playerId="Player 1"
          isCurrentTurn={gameData.turn === 'player1'}
          symbol="X"
        />
        <GameBoard roomId={roomId} playerId={playerId} />
        <PlayerInfo
          playerId="Player 2"
          isCurrentTurn={gameData.turn === 'player2'}
          symbol="O"
        />
      </Grid>
    </Container>
  );
} 