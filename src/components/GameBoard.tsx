import { Grid, Button, Text, VStack, useToast } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface GameBoardProps {
  roomId: string;
  playerId: string;
}

const GameBoard = ({ roomId, playerId }: GameBoardProps) => {
  const [board, setBoard] = useState<string[]>(Array(9).fill(''));
  const [currentTurn, setCurrentTurn] = useState<string>('');
  const [gameStatus, setGameStatus] = useState<string>('waiting');
  const [winner, setWinner] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const gameRef = doc(db, 'rooms', roomId);
    
    const unsubscribe = onSnapshot(
      gameRef,
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setBoard(data.board);
          setCurrentTurn(data.turn);
          setGameStatus(data.status);
          setWinner(data.winner);
          setIsOffline(false);
        }
      },
      (error) => {
        console.error('Error fetching game data:', error);
        setIsOffline(true);
        toast({
          title: 'Connection Error',
          description: 'Unable to connect to the game server. Please check your internet connection.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    );

    return () => unsubscribe();
  }, [roomId, toast]);

  const handleCellClick = async (index: number) => {
    if (board[index] !== '' || currentTurn !== playerId || gameStatus !== 'playing' || isOffline) {
      return;
    }

    try {
      const gameRef = doc(db, 'rooms', roomId);
      const newBoard = [...board];
      newBoard[index] = currentTurn === playerId ? 'X' : 'O';

      const winner = checkWinner(newBoard);
      const isTie = !winner && newBoard.every(cell => cell !== '');

      await updateDoc(gameRef, {
        board: newBoard,
        turn: currentTurn === playerId ? 'player2' : 'player1',
        status: winner ? 'won' : isTie ? 'tie' : 'playing',
        winner: winner || null,
      });
    } catch (error) {
      console.error('Error updating game:', error);
      toast({
        title: 'Error',
        description: 'Failed to update the game. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const checkWinner = (board: string[]): string | null => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (const [a, b, c] of lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  };

  const handleRematch = async () => {
    if (isOffline) return;

    try {
      const gameRef = doc(db, 'rooms', roomId);
      await updateDoc(gameRef, {
        board: Array(9).fill(''),
        turn: 'player1',
        status: 'playing',
        winner: null,
      });
    } catch (error) {
      console.error('Error starting rematch:', error);
      toast({
        title: 'Error',
        description: 'Failed to start rematch. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack spacing={4}>
      {isOffline && (
        <Text color="red.500" fontWeight="bold">
          You are offline. Please check your internet connection.
        </Text>
      )}
      
      <Text fontSize="2xl" fontWeight="bold">
        {gameStatus === 'waiting' && 'Waiting for opponent...'}
        {gameStatus === 'playing' && `Current Turn: ${currentTurn === playerId ? 'Your Turn' : 'Opponent\'s Turn'}`}
        {gameStatus === 'won' && `Winner: ${winner === 'X' ? 'Player 1' : 'Player 2'}`}
        {gameStatus === 'tie' && 'Game Tied!'}
      </Text>

      <Grid templateColumns="repeat(3, 1fr)" gap={2}>
        {board.map((cell, index) => (
          <Button
            key={index}
            w="100px"
            h="100px"
            fontSize="4xl"
            onClick={() => handleCellClick(index)}
            isDisabled={gameStatus !== 'playing' || currentTurn !== playerId || isOffline}
          >
            {cell}
          </Button>
        ))}
      </Grid>

      {(gameStatus === 'won' || gameStatus === 'tie') && (
        <Button 
          colorScheme="blue" 
          onClick={handleRematch}
          isDisabled={isOffline}
        >
          Rematch
        </Button>
      )}
    </VStack>
  );
};

export default GameBoard; 