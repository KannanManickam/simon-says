
import React, { useEffect } from 'react';
import { GameProvider, useGame } from '@/context/GameContext';
import GameBoard from '@/components/GameBoard';
import { playErrorSound, playSuccessSound } from '@/utils/soundUtils';
import { initAudio } from '@/utils/soundUtils';

// Game container with audio initialization
const GameContainer = () => {
  const { gameState, soundEnabled, score } = useGame();
  
  // Initialize audio on first interaction
  useEffect(() => {
    const handleUserInteraction = () => {
      initAudio();
      // Clean up event listener after initialization
      document.removeEventListener('click', handleUserInteraction);
    };
    
    document.addEventListener('click', handleUserInteraction);
    
    return () => {
      document.removeEventListener('click', handleUserInteraction);
    };
  }, []);
  
  // Play sound effects based on game state
  useEffect(() => {
    if (!soundEnabled) return;
    
    if (gameState === 'gameOver') {
      playErrorSound();
    }
  }, [gameState, soundEnabled]);
  
  // Play success sound on milestone scores
  useEffect(() => {
    if (soundEnabled && score > 0 && score % 5 === 0 && gameState === 'userInput') {
      playSuccessSound();
    }
  }, [score, gameState, soundEnabled]);
  
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
