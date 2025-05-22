'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { doc, onSnapshot, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import GameBoard from '@/components/GameBoard';
import PlayerInfo from '@/components/PlayerInfo';
import ThemeToggle from '@/components/ThemeToggle';
import { Chat } from '@/components/Chat';

interface GameData {
  board: string[];
  currentTurn: string;
  gameStatus: 'waiting' | 'playing' | 'won' | 'tie';
  winner: string | null;
  players: {
    player1?: string;
    player2?: string;
  };
}

export default function GamePage({ params }: { params: { roomId: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const username = searchParams.get('username');
  const [gameData, setGameData] = useState<GameData>({
    board: Array(9).fill(''),
    currentTurn: 'player1',
    gameStatus: 'waiting',
    winner: null,
    players: {}
  });
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    if (!username) {
      router.push('/');
      return;
    }

    const gameRef = doc(db, 'games', params.roomId);
    const unsubscribe = onSnapshot(gameRef, async (doc) => {
      if (!doc.exists()) {
        // Create new game if it doesn't exist
        const newGameData: GameData = {
          board: Array(9).fill(''),
          currentTurn: 'player1',
          gameStatus: 'waiting',
          winner: null,
          players: { player1: username }
        };
        await setDoc(gameRef, newGameData);
        setGameData(newGameData);
        setPlayerId('player1');
        return;
      }

      const data = doc.data() as GameData;
      setGameData(data);

      // Assign player ID if not already assigned
      if (!playerId) {
        if (!data.players.player1) {
          await updateDoc(gameRef, {
            'players.player1': username
          });
          setPlayerId('player1');
        } else if (!data.players.player2 && data.players.player1 !== username) {
          await updateDoc(gameRef, {
            'players.player2': username,
            gameStatus: 'playing'
          });
          setPlayerId('player2');
        } else if (data.players.player1 === username) {
          setPlayerId('player1');
        } else if (data.players.player2 === username) {
          setPlayerId('player2');
        }
      }
    });

    return () => unsubscribe();
  }, [params.roomId, username, router, playerId]);

  // Clean up game room after game ends
  useEffect(() => {
    if (gameData.gameStatus === 'won' || gameData.gameStatus === 'tie') {
      setCountdown(10);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(timer);
            return null;
          }
          return prev - 1;
        });
      }, 1000);

      const cleanupTimer = setTimeout(async () => {
        const gameRef = doc(db, 'games', params.roomId);
        await deleteDoc(gameRef);
        router.push('/');
      }, 10000);

      return () => {
        clearInterval(timer);
        clearTimeout(cleanupTimer);
      };
    }
  }, [gameData.gameStatus, params.roomId, router]);

  if (!playerId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-xl text-gray-900 dark:text-white">
          Waiting to join game...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <ThemeToggle />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
          <div>
            <div className="mb-8">
              <div className="grid grid-cols-2 gap-4">
                <PlayerInfo
                  name={gameData.players.player1 || 'Player 1'}
                  symbol="X"
                  isCurrentTurn={gameData.currentTurn === 'player1'}
                />
                <PlayerInfo
                  name={gameData.players.player2 || 'Player 2'}
                  symbol="O"
                  isCurrentTurn={gameData.currentTurn === 'player2'}
                />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
              <GameBoard
                roomId={params.roomId}
                playerId={playerId}
                playerName={username || ''}
              />

              {(gameData.gameStatus === 'won' || gameData.gameStatus === 'tie') && (
                <div className="mt-8 text-center">
                  <p className="text-2xl font-bold mb-4">
                    {gameData.gameStatus === 'won'
                      ? `Winner: ${gameData.winner === playerId ? 'You' : 'Opponent'}!`
                      : "It's a tie!"}
                  </p>
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    Redirecting to home page in {countdown} seconds...
                  </p>
                </div>
              )}
            </div>
          </div>

          <div>
            <Chat roomId={params.roomId} playerName={username || ''} />
          </div>
        </div>
      </div>
    </div>
  );
} 