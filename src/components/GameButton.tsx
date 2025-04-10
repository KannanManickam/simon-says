
import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ButtonColor, useGame } from '@/context/GameContext';
import { playTone } from '@/utils/soundUtils';

interface GameButtonProps {
  color: ButtonColor;
}

const GameButton: React.FC<GameButtonProps> = ({ color }) => {
  const { handleButtonPress, isButtonActive, gameState } = useGame();
  
  const isActive = isButtonActive(color);
  
  // Play sound when button is active
  useEffect(() => {
    if (isActive) {
      playTone(color);
    }
  }, [isActive, color]);
  
  // Colors and styles for each button
  const buttonColors = {
    red: {
      base: 'bg-simon-red/70 hover:bg-simon-red/80',
      active: 'bg-simon-red',
    },
    blue: {
      base: 'bg-simon-blue/70 hover:bg-simon-blue/80',
      active: 'bg-simon-blue',
    },
    green: {
      base: 'bg-simon-green/70 hover:bg-simon-green/80',
      active: 'bg-simon-green',
    },
    yellow: {
      base: 'bg-simon-yellow/70 hover:bg-simon-yellow/80',
      active: 'bg-simon-yellow',
    },
  };
  
  // Position classes for each button
  const positionClasses = {
    red: 'rounded-tl-full',
    blue: 'rounded-tr-full',
    green: 'rounded-bl-full',
    yellow: 'rounded-br-full',
  };
  
  return (
    <button
      className={cn(
        'w-full h-full transition-all duration-200 shadow-lg',
        buttonColors[color].base,
        positionClasses[color],
        isActive && buttonColors[color].active,
        isActive && 'animate-button-flash shadow-xl',
        gameState === 'sequence' && 'cursor-not-allowed',
        gameState === 'userInput' && 'cursor-pointer'
      )}
      onClick={() => handleButtonPress(color)}
      disabled={gameState !== 'userInput'}
      aria-label={`${color} button`}
    />
  );
};

export default GameButton;
