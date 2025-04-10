
import React, { useEffect } from 'react';
import { GameProvider } from '@/context/GameContext';
import GameBoard from '@/components/GameBoard';
import { playErrorSound } from '@/utils/soundUtils';
import { useGame } from '@/context/GameContext';

// Game container with audio initialization
const GameContainer = () => {
  const { gameState } = useGame();
  
  // Play error sound on game over
  useEffect(() => {
    if (gameState === 'gameOver') {
      playErrorSound();
    }
  }, [gameState]);
  
  return <GameBoard />;
};

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-simon-background p-4">
      <GameProvider>
        <GameContainer />
      </GameProvider>
    </div>
  );
};

export default Index;
