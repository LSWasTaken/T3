'use client';

interface PlayerInfoProps {
  name: string;
  symbol: 'X' | 'O';
  isCurrentTurn: boolean;
}

export default function PlayerInfo({ name, symbol, isCurrentTurn }: PlayerInfoProps) {
  return (
    <div className={`
      flex flex-col items-center p-4 rounded-lg
      ${isCurrentTurn ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-gray-800'}
      transition-colors
    `}>
      <div className="text-2xl font-bold mb-2">
        {symbol}
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-300">
        {name}
      </div>
      {isCurrentTurn && (
        <div className="text-xs text-blue-500 dark:text-blue-400 mt-1">
          Your turn
        </div>
      )}
    </div>
  );
} 