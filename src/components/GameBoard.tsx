'use client';

import { useEffect, useState } from 'react';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface GameBoardProps {
  roomId: string;
  playerId: string;
  playerName: string;
}

export default function GameBoard({ roomId, playerId, playerName }: GameBoardProps) {
  const [board, setBoard] = useState<string[]>(Array(9).fill(''));
  const [currentTurn, setCurrentTurn] = useState<string>('player1');
  const [winner, setWinner] = useState<string | null>(null);
  const [gameStatus, setGameStatus] = useState<'waiting' | 'playing' | 'won' | 'tie'>('waiting');

  useEffect(() => {
    const gameRef = doc(db, 'games', roomId);
    const unsubscribe = onSnapshot(gameRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setBoard(data.board || Array(9).fill(''));
        setCurrentTurn(data.currentTurn || 'player1');
        setWinner(data.winner || null);
        setGameStatus(data.gameStatus || 'waiting');
      }
    });

    return () => unsubscribe();
  }, [roomId]);

  const handleCellClick = async (index: number) => {
    if (
      gameStatus !== 'playing' ||
      currentTurn !== playerId ||
      board[index] !== '' ||
      winner
    ) {
      return;
    }

    const newBoard = [...board];
    newBoard[index] = playerId === 'player1' ? 'X' : 'O';
    setBoard(newBoard);

    const gameRef = doc(db, 'games', roomId);
    await updateDoc(gameRef, {
      board: newBoard,
      currentTurn: currentTurn === 'player1' ? 'player2' : 'player1',
    });

    // Check for winner
    const winningCombos = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (const combo of winningCombos) {
      const [a, b, c] = combo;
      if (
        newBoard[a] &&
        newBoard[a] === newBoard[b] &&
        newBoard[a] === newBoard[c]
      ) {
        setWinner(playerId);
        await updateDoc(gameRef, {
          winner: playerId,
          gameStatus: 'won'
        });
        return;
      }
    }

    // Check for tie
    if (!newBoard.includes('')) {
      await updateDoc(gameRef, {
        gameStatus: 'tie'
      });
    }
  };

  const getStatusMessage = () => {
    if (gameStatus === 'waiting') return 'Waiting for opponent...';
    if (winner) return `Winner: ${winner === playerId ? 'You' : 'Opponent'}!`;
    if (gameStatus === 'tie') return "It's a tie!";
    return `Current turn: ${currentTurn === playerId ? 'Your' : 'Opponent\'s'}`;
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="text-2xl font-bold text-gray-900 dark:text-white">
        {getStatusMessage()}
      </div>
      <div className="grid grid-cols-3 gap-3 bg-gray-200 dark:bg-gray-700 p-3 rounded-xl">
        {board.map((cell, index) => (
          <button
            key={index}
            onClick={() => handleCellClick(index)}
            disabled={gameStatus !== 'playing' || currentTurn !== playerId || cell !== ''}
            className={`
              w-24 h-24 flex items-center justify-center text-5xl font-bold
              bg-white dark:bg-gray-800 rounded-lg shadow-md
              ${cell === 'X' ? 'text-blue-500' : cell === 'O' ? 'text-red-500' : 'text-gray-400'}
              ${gameStatus === 'playing' && currentTurn === playerId && cell === '' 
                ? 'hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]' 
                : 'cursor-not-allowed'}
              transition-all duration-200
            `}
          >
            {cell}
          </button>
        ))}
      </div>
    </div>
  );
} 