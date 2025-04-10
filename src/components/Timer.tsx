
import React from 'react';
import { useGame } from '@/context/GameContext';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';

const Timer: React.FC = () => {
  const { timeRemaining, maxTimePerRound, gameState } = useGame();
  
  // Only show timer during user input
  if (gameState !== 'userInput') return null;
  
  // Calculate percentage for visual representation
  const percentRemaining = (timeRemaining / maxTimePerRound) * 100;
  
  // Determine color based on time remaining
  const getColorClass = () => {
    if (percentRemaining > 60) return 'text-green-500';
    if (percentRemaining > 30) return 'text-yellow-500';
    return 'text-red-500 animate-pulse';
  };
  
  return (
    <div className="flex items-center gap-2 mb-4 font-mono">
      <Clock className={cn("w-5 h-5", getColorClass())} />
      <span className={cn("font-bold text-xl", getColorClass())}>
        {timeRemaining}s
      </span>
    </div>
  );
};

export default Timer;
