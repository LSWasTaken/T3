import { Box, Text, VStack, Avatar } from '@chakra-ui/react';

interface PlayerInfoProps {
  playerId: string;
  isCurrentTurn: boolean;
  symbol: 'X' | 'O';
}

const PlayerInfo = ({ playerId, isCurrentTurn, symbol }: PlayerInfoProps) => {
  return (
    <VStack spacing={2}>
      <Avatar
        size="lg"
        name={playerId}
        bg={isCurrentTurn ? 'blue.500' : 'gray.200'}
      />
      <Text fontWeight="bold">{playerId}</Text>
      <Text fontSize="2xl" color={symbol === 'X' ? 'blue.500' : 'red.500'}>
        {symbol}
      </Text>
      {isCurrentTurn && (
        <Text color="green.500" fontWeight="bold">
          Your Turn
        </Text>
      )}
    </VStack>
  );
};

export default PlayerInfo; 