import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ButtonColor, useGame } from '@/context/GameContext';
import { playTone } from '@/utils/soundUtils';

interface GameButtonProps {
  color: ButtonColor;
}

const GameButton: React.FC<GameButtonProps> = ({ color }) => {
  const { 
    handleButtonPress, 
    isButtonActive, 
    gameState, 
    soundEnabled,
    voiceInstructionsEnabled,
    getButtonColor
  } = useGame();
  
  const isActive = isButtonActive(color);
  
  // Play sound when button is active (only for game sounds, not voice instructions)
  useEffect(() => {
    if (isActive && soundEnabled && (!voiceInstructionsEnabled || gameState !== 'sequence')) {
      playTone(color);
    }
  }, [isActive, color, soundEnabled, voiceInstructionsEnabled, gameState]);
  
  // Position classes for each button
  const positionClasses = {
    red: 'rounded-tl-full',
    blue: 'rounded-tr-full',
    green: 'rounded-bl-full',
    yellow: 'rounded-br-full',
  };
  
  // Get button color from theme
  const buttonColor = getButtonColor(color);
  
  return (
    <button
      className={cn(
        'w-full h-full transition-all duration-200 shadow-lg',
        positionClasses[color],
        isActive && 'animate-button-flash shadow-xl',
        gameState === 'sequence' && 'cursor-not-allowed',
        gameState === 'userInput' && 'cursor-pointer'
      )}
      style={{
        backgroundColor: isActive ? buttonColor : `${buttonColor}85`, // Using hex alpha for inactive state
        boxShadow: isActive ? `0 0 20px ${buttonColor}` : undefined,
      }}
      onClick={() => handleButtonPress(color)}
      disabled={gameState !== 'userInput'}
      aria-label={`${color} button`}
    />
  );
};

export default GameButton;
