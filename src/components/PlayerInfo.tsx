'use client';

interface PlayerInfoProps {
  name: string;
  symbol: 'X' | 'O';
  isCurrentTurn: boolean;
}

export default function PlayerInfo({ name, symbol, isCurrentTurn }: PlayerInfoProps) {
  return (
    <div className={`
      flex flex-col items-center p-6 rounded-xl shadow-lg
      ${isCurrentTurn 
        ? 'bg-blue-100 dark:bg-blue-900 border-2 border-blue-500 dark:border-blue-400' 
        : 'bg-gray-100 dark:bg-gray-800 border-2 border-transparent'}
      transition-all duration-200
    `}>
      <div className={`
        text-4xl font-bold mb-3
        ${symbol === 'X' ? 'text-blue-500' : 'text-red-500'}
      `}>
        {symbol}
      </div>
      <div className="text-lg font-medium text-gray-900 dark:text-white">
        {name}
      </div>
      {isCurrentTurn && (
        <div className="text-sm text-blue-500 dark:text-blue-400 mt-2 font-medium">
          Your turn
        </div>
      )}
    </div>
  );
} 