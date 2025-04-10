
import React from 'react';
import GameButton from './GameButton';
import { useGame } from '@/context/GameContext';

const GameBoard: React.FC = () => {
  const { gameState, score, highScore, startGame } = useGame();
  
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="text-center mb-6">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
          Simon Says
        </h1>
        
        {gameState !== 'start' && (
          <div className="mb-4 flex gap-8 justify-center">
            <div className="text-white">
              <p className="text-lg opacity-80">Score</p>
              <p className="text-3xl font-bold">{score}</p>
            </div>
            <div className="text-white">
              <p className="text-lg opacity-80">Best</p>
              <p className="text-3xl font-bold">{highScore}</p>
            </div>
          </div>
        )}
        
        {gameState === 'start' && (
          <div className="mb-8">
            <p className="text-white text-lg mb-6">
              Watch the sequence, then repeat it by pressing the buttons in the same order.
            </p>
            <button
              onClick={startGame}
              className="px-8 py-3 bg-white text-simon-background rounded-full text-xl font-bold transition-transform hover:scale-105 animate-pulse-scale"
            >
              Start Game
            </button>
          </div>
        )}
        
        {gameState === 'gameOver' && (
          <div className="mb-8">
            <p className="text-white text-2xl mb-6 font-bold">Game Over!</p>
            <button
              onClick={startGame}
              className="px-8 py-3 bg-white text-simon-background rounded-full text-xl font-bold transition-transform hover:scale-105"
            >
              Play Again
            </button>
          </div>
        )}
        
        {gameState === 'sequence' && (
          <p className="text-white text-xl mb-4">Watch carefully...</p>
        )}
        
        {gameState === 'userInput' && (
          <p className="text-white text-xl mb-4">Your turn!</p>
        )}
      </div>
      
      <div className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 grid grid-cols-2 gap-4 p-4 rounded-full bg-slate-800 shadow-2xl">
        <GameButton color="red" />
        <GameButton color="blue" />
        <GameButton color="green" />
        <GameButton color="yellow" />
      </div>
    </div>
  );
};

export default GameBoard;
