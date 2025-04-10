
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the available colors
export type ButtonColor = 'red' | 'blue' | 'green' | 'yellow';

// Game states
export type GameState = 'start' | 'sequence' | 'userInput' | 'gameOver';

interface GameContextType {
  gameState: GameState;
  score: number;
  highScore: number;
  sequence: ButtonColor[];
  userSequence: ButtonColor[];
  activeButton: ButtonColor | null;
  timeRemaining: number;
  maxTimePerRound: number;
  startGame: () => void;
  handleButtonPress: (color: ButtonColor) => void;
  isButtonActive: (color: ButtonColor) => boolean;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>('start');
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [sequence, setSequence] = useState<ButtonColor[]>([]);
  const [userSequence, setUserSequence] = useState<ButtonColor[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [activeButton, setActiveButton] = useState<ButtonColor | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [maxTimePerRound, setMaxTimePerRound] = useState<number>(5);

  // Load high score from localStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem('simonHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  // Save high score to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('simonHighScore', highScore.toString());
  }, [highScore]);

  // Generate a random button color
  const getRandomButton = (): ButtonColor => {
    const buttons: ButtonColor[] = ['red', 'blue', 'green', 'yellow'];
    return buttons[Math.floor(Math.random() * buttons.length)];
  };

  // Timer for user input
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    if (gameState === 'userInput' && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timer as NodeJS.Timeout);
            setGameState('gameOver');
            if (score > highScore) {
              setHighScore(score);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [gameState, timeRemaining, score, highScore]);

  // Start a new game
  const startGame = () => {
    // Reset game state
    setScore(0);
    setSequence([getRandomButton()]);
    setUserSequence([]);
    setCurrentStep(0);
    setTimeRemaining(5); // Initial time for first level
    setGameState('sequence');
  };

  // Play the sequence for the user to watch
  useEffect(() => {
    if (gameState !== 'sequence') return;

    let step = 0;
    const playSequence = () => {
      // Play the current step in the sequence
      setActiveButton(sequence[step]);
      
      // After a short delay, turn off the button
      setTimeout(() => {
        setActiveButton(null);
        step++;
        
        if (step < sequence.length) {
          // Continue to the next step after a gap
          setTimeout(playSequence, 300);
        } else {
          // Sequence is complete, user's turn
          // Set time limit based on sequence length (harder as game progresses)
          setTimeRemaining(Math.max(5, Math.min(10, sequence.length * 1.5)));
          setMaxTimePerRound(Math.max(5, Math.min(10, sequence.length * 1.5)));
          setGameState('userInput');
        }
      }, 600);
    };

    // Start playing the sequence after a short delay
    const timer = setTimeout(playSequence, 1000);
    
    return () => clearTimeout(timer);
  }, [gameState, sequence]);

  // Handle user button presses
  const handleButtonPress = (color: ButtonColor) => {
    if (gameState !== 'userInput') return;

    // Briefly highlight the pressed button
    setActiveButton(color);
    setTimeout(() => setActiveButton(null), 300);

    // Add the button to userSequence
    const newUserSequence = [...userSequence, color];
    setUserSequence(newUserSequence);

    // Check if the user pressed the correct button
    if (color !== sequence[userSequence.length]) {
      // User made a mistake
      setGameState('gameOver');
      if (score > highScore) {
        setHighScore(score);
      }
      return;
    }

    // Check if the user completed the current sequence
    if (newUserSequence.length === sequence.length) {
      // User completed the sequence correctly
      setScore(score + 1);
      setUserSequence([]);
      
      // Add a new random button to the sequence and play it
      setTimeout(() => {
        setSequence([...sequence, getRandomButton()]);
        setGameState('sequence');
      }, 1000);
    } else {
      // User has more buttons to press in this sequence
      setUserSequence(newUserSequence);
    }
  };

  // Check if a button should be highlighted
  const isButtonActive = (color: ButtonColor): boolean => {
    return activeButton === color;
  };

  const value = {
    gameState,
    score,
    highScore,
    sequence,
    userSequence,
    activeButton,
    timeRemaining,
    maxTimePerRound,
    startGame,
    handleButtonPress,
    isButtonActive,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
