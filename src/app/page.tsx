'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { nanoid } from 'nanoid';
import UsernameInput from '@/components/UsernameInput';
import ThemeToggle from '@/components/ThemeToggle';

export default function Home() {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState('');
  const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<'create' | 'join' | null>(null);

  const handleCreateGame = () => {
    setPendingAction('create');
    setIsUsernameModalOpen(true);
  };

  const handleJoinGame = () => {
    if (!roomCode) {
      alert('Please enter a room code');
      return;
    }
    setPendingAction('join');
    setIsUsernameModalOpen(true);
  };

  const handleUsernameSubmit = (username: string) => {
    if (pendingAction === 'create') {
      const newRoomId = nanoid(6);
      router.push(`/game/${newRoomId}?username=${encodeURIComponent(username)}`);
    } else if (pendingAction === 'join') {
      router.push(`/game/${roomCode}?username=${encodeURIComponent(username)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <ThemeToggle />
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-md mx-auto">
          <h1 className="text-5xl font-bold text-center text-gray-900 dark:text-white mb-4">
            Tic Tac Toe
          </h1>
          <p className="text-xl text-center text-gray-600 dark:text-gray-300 mb-12">
            Play Tic Tac Toe with your friends in real-time!
          </p>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
            <div className="space-y-6">
              <button
                onClick={handleCreateGame}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
              >
                Create New Game
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                    or
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Join Existing Game
                </label>
                <input
                  type="text"
                  placeholder="Enter room code"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white shadow-sm"
                />
              </div>

              <button
                onClick={handleJoinGame}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
              >
                Join Game
              </button>
            </div>
          </div>
        </div>
      </div>

      <UsernameInput
        isOpen={isUsernameModalOpen}
        onClose={() => setIsUsernameModalOpen(false)}
        onSubmit={handleUsernameSubmit}
      />
    </div>
  );
}
