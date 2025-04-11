
import React, { useEffect, useRef, useState } from 'react';
import GameButton from './GameButton';
import ProgressBar from './ProgressBar';
import Timer from './Timer';
import SettingsMenu from './SettingsMenu';
import { useGame } from '@/context/GameContext';
import { Sparkles, Trophy, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const GameBoard: React.FC = () => {
  const { 
    gameState, 
    score, 
    highScore, 
    startGame,
    restartGame,
    getBackgroundColor,
    activeButton,
    voiceInstructionsEnabled,
    sequence,
    currentRound
  } = useGame();
  
  const { toast } = useToast();
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [roundAnnounced, setRoundAnnounced] = useState(false);
  
  // Clean up speech synthesis when component unmounts
  useEffect(() => {
    return () => {
      if (speechRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);
  
  // Reset round announced flag when game state changes
  useEffect(() => {
    if (gameState === 'sequence' && !roundAnnounced) {
      setRoundAnnounced(true);
    } else if (gameState !== 'sequence') {
      setRoundAnnounced(false);
    }
  }, [gameState, roundAnnounced]);
  
  // Voice instruction effect
  useEffect(() => {
    if (!voiceInstructionsEnabled || !activeButton || gameState !== 'sequence') return;
    
    // Create a speech synthesis utterance
    if (speechRef.current) {
      window.speechSynthesis.cancel(); // Cancel any ongoing speech
    }
    
    const utterance = new SpeechSynthesisUtterance();
    
    // Say "Simon says" at the start of a new round
    if (!roundAnnounced && sequence.length > 0) {
      utterance.text = `Simon says ${activeButton}`;
      setRoundAnnounced(true);
    } else {
      utterance.text = activeButton;
    }
    
    utterance.rate = 0.9; // Slightly slower rate for better clarity
    utterance.pitch = 1.0;
    utterance.volume = 1.0; // Maximum volume
    speechRef.current = utterance;
    
    // Add a small delay to ensure the speech synthesis is ready
    const timer = setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 100);
    
    return () => {
      clearTimeout(timer);
      // Don't cancel immediately on cleanup to allow speech to complete
    };
  }, [activeButton, gameState, voiceInstructionsEnabled, sequence, roundAnnounced]);
  
  // Get dynamic background color from theme
  const backgroundColor = getBackgroundColor();
  
  return (
    <div className="h-full flex flex-col items-center justify-center" style={{ backgroundColor }}>
      <div className="fixed top-4 right-4 z-10">
        <SettingsMenu />
      </div>
      
      <div className="text-center mb-6 relative z-0">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 flex items-center justify-center gap-2">
          Simon Says
          {score >= 10 && <Sparkles className="text-yellow-400 h-8 w-8 animate-pulse" />}
        </h1>
        
        {gameState !== 'start' && (
          <div className="mb-4 flex gap-8 justify-center">
            <div className="text-white">
              <p className="text-lg opacity-80">Score</p>
              <p className="text-3xl font-bold">{score}</p>
            </div>
            <div className="text-white relative">
              <p className="text-lg opacity-80 flex items-center gap-1">
                <Trophy className="h-4 w-4 text-yellow-400" />
                Best
              </p>
              <p className="text-3xl font-bold">{highScore}</p>
            </div>
          </div>
        )}
        
        {gameState === 'start' && (
          <div className="mb-8">
            <p className="text-white text-lg mb-6">
              {voiceInstructionsEnabled 
                ? "Listen carefully to 'Simon Says' commands, then repeat the sequence."
                : "Watch the sequence, then repeat it by pressing the buttons in the same order."}
            </p>
            <Button
              onClick={startGame}
              className="px-8 py-6 bg-white text-simon-background rounded-full text-xl font-bold transition-transform hover:scale-105 animate-pulse-scale"
            >
              Start Game
            </Button>
          </div>
        )}
        
        {gameState === 'gameOver' && (
          <div className="mb-8 space-y-4">
            <p className="text-white text-2xl mb-6 font-bold animate-bounce">Game Over!</p>
            <div className="flex justify-center">
              <Button
                onClick={restartGame}
                className="px-8 py-3 bg-white text-simon-background rounded-full text-xl font-bold transition-transform hover:scale-105 flex items-center gap-2"
              >
                <RotateCcw className="h-5 w-5" />
                Play Again
              </Button>
            </div>
          </div>
        )}
        
        {gameState === 'sequence' && (
          <p className="text-white text-xl mb-4 animate-pulse">
            {voiceInstructionsEnabled 
              ? "Listen carefully..." 
              : "Watch carefully..."}
          </p>
        )}
        
        {gameState === 'userInput' && (
          <p className="text-white text-xl mb-4">Your turn!</p>
        )}
      </div>
      
      <div className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 grid grid-cols-2 gap-4 p-4 rounded-full bg-slate-800/50 backdrop-blur-lg shadow-2xl transition-all duration-300 hover:shadow-xl">
        <GameButton color="red" />
        <GameButton color="blue" />
        <GameButton color="green" />
        <GameButton color="yellow" />
      </div>
      
      {gameState === 'userInput' && (
        <div className="fixed bottom-8 left-0 right-0 flex flex-col items-center mt-8">
          <Timer />
          <ProgressBar />
        </div>
      )}
    </div>
  );
};

export default GameBoard;
