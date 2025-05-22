'use client';

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0]?.toUpperCase())
    .join('')
    .slice(0, 2);
}

interface PlayerInfoProps {
  name: string;
  symbol: 'X' | 'O';
  isCurrentTurn: boolean;
}

export default function PlayerInfo({ name, symbol, isCurrentTurn }: PlayerInfoProps) {
  return (
    <div
      className={`
        flex flex-col items-center p-8 rounded-3xl shadow-xl
        ${isCurrentTurn
          ? 'bg-blue-100/60 dark:bg-blue-900/60 border-2 border-blue-400/60 dark:border-blue-300/60'
          : 'bg-white/40 dark:bg-gray-800/40 border-2 border-transparent'}
        backdrop-blur-md transition-all duration-200
      `}
    >
      <div className="mb-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 flex items-center justify-center text-white text-3xl font-bold shadow-lg border-4 border-white/60 dark:border-gray-900/60">
          {getInitials(name)}
        </div>
      </div>
      <div className={`text-4xl font-bold mb-2 ${symbol === 'X' ? 'text-blue-500' : 'text-red-500'}`}>{symbol}</div>
      <div className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight mb-1">{name}</div>
      {isCurrentTurn && (
        <div className="text-sm text-blue-500 dark:text-blue-300 mt-2 font-medium animate-pulse">
          Your turn
        </div>
      )}
    </div>
  );
} 