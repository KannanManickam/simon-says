
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { useGame } from '@/context/GameContext';

const ProgressBar: React.FC = () => {
  const { sequence, userSequence, gameState } = useGame();
  
  // Calculate progress percentage
  const calculateProgress = () => {
    if (sequence.length === 0) return 0;
    if (gameState === 'sequence') return 0;
    return Math.round((userSequence.length / sequence.length) * 100);
  };
  
  // Get progress color based on completion
  const getProgressColor = () => {
    const progress = calculateProgress();
    if (progress >= 75) return 'bg-green-500';
    if (progress >= 40) return 'bg-blue-500';
    return 'bg-purple-500';
  };
  
  return (
    <div className="w-full max-w-md px-4">
      <Progress 
        value={calculateProgress()} 
        className={`h-2 bg-slate-600 transition-all ${getProgressColor()}`}
      />
      <div className="flex justify-between text-xs text-white mt-1 opacity-70">
        <span>0%</span>
        <span>Progress</span>
        <span>100%</span>
      </div>
    </div>
  );
};

export default ProgressBar;
