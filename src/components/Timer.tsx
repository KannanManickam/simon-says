
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
    <div className="flex flex-col items-center mb-2">
      <div className="flex items-center gap-2 font-mono">
        <Clock className={cn("w-5 h-5", getColorClass())} />
        <span className={cn("font-bold text-xl", getColorClass())}>
          {timeRemaining}s
        </span>
      </div>
      
      {/* Visual timer bar */}
      <div className="w-32 h-2 bg-gray-700 rounded-full mt-1 mb-3 overflow-hidden">
        <div 
          className={cn(
            "h-full transition-all duration-1000 ease-linear rounded-full",
            percentRemaining > 60 ? "bg-green-500" : 
            percentRemaining > 30 ? "bg-yellow-500" : "bg-red-500"
          )}
          style={{width: `${percentRemaining}%`}}
        />
      </div>
    </div>
  );
};

export default Timer;
