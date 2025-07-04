import React, { useEffect, useRef, useState } from 'react';
import GameButton from './GameButton';
import Timer from './Timer';
import SettingsMenu from './SettingsMenu';
import RoundConfetti from './RoundConfetti';
import { useGame } from '@/context/GameContext';
import { Sparkles, Trophy, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    currentRound,
    currentStep,
  } = useGame();
  
  const [showConfetti, setShowConfetti] = useState(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [simonSaysAnnounced, setSimonSaysAnnounced] = useState(false);

  // Effect to handle confetti display when round is completed
  useEffect(() => {
    if (gameState === 'sequence' && currentStep === 0) {
      // Show confetti when a new sequence starts (meaning previous round was completed)
      if (currentRound > 1) {
        setShowConfetti(true);
        // Hide confetti after animation
        const timer = setTimeout(() => {
          setShowConfetti(false);
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [gameState, currentStep, currentRound]);
  
  // Clean up speech synthesis when component unmounts
  useEffect(() => {
    return () => {
      if (speechRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);
  
  // Reset simon says announced flag when starting a new sequence display
  useEffect(() => {
    if (gameState === 'sequence' && currentStep === 0) {
      setSimonSaysAnnounced(false);
    }
  }, [gameState, currentStep]);
  
  // Voice instruction effect - completely revised to handle sequence properly
  useEffect(() => {
    if (!voiceInstructionsEnabled || gameState !== 'sequence') return;
    
    // Cancel any ongoing speech
    if (speechRef.current) {
      window.speechSynthesis.cancel();
    }
    
    // Create a speech synthesis utterance
    const utterance = new SpeechSynthesisUtterance();
    
    // First announce "Simon Says" at the beginning of sequence display
    if (!simonSaysAnnounced && currentStep === 0) {
      utterance.text = `Simon says`;
      setSimonSaysAnnounced(true);
      
      utterance.rate = 1.1; // Slightly faster rate for better sync with visual
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      speechRef.current = utterance;
      
      // Speak immediately
      window.speechSynthesis.speak(utterance);
      
      // Don't proceed with color announcement yet
      return;
    } 
    // Then announce the current color if active
    else if (activeButton) {
      utterance.text = activeButton;
      
      utterance.rate = 1.1; // Faster rate for better sync with visual
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      speechRef.current = utterance;
      
      // Speak immediately
      window.speechSynthesis.speak(utterance);
    }
  }, [activeButton, gameState, voiceInstructionsEnabled, currentStep, simonSaysAnnounced]);
  
  // Get dynamic background color from theme
  const backgroundColor = getBackgroundColor();
  
  return (
    <div className="h-full flex flex-col items-center justify-center" style={{ backgroundColor }}>
      <RoundConfetti isVisible={showConfetti} />
      
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
        </div>
      )}
    </div>
  );
};

export default GameBoard;
