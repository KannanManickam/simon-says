import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/components/ui/use-toast';

// Define the available colors
export type ButtonColor = 'red' | 'blue' | 'green' | 'yellow';

// Game states
export type GameState = 'start' | 'sequence' | 'userInput' | 'gameOver';

// Theme IDs
export type ThemeId = 'classic' | 'pastel' | 'neon' | 'monochrome';

// Theme color mappings
export const themeColors = {
  classic: {
    red: '#FF4136',
    blue: '#0074D9',
    green: '#2ECC40',
    yellow: '#FFDC00',
    background: '#333333',
  },
  pastel: {
    red: '#FFB3B3',
    blue: '#B3D9FF',
    green: '#B3FFB3',
    yellow: '#FFFFB3',
    background: '#555555',
  },
  neon: {
    red: '#FF00FF',
    blue: '#00FFFF',
    green: '#00FF00',
    yellow: '#FFFF00',
    background: '#222222',
  },
  monochrome: {
    red: '#555555',
    blue: '#777777',
    green: '#999999',
    yellow: '#BBBBBB',
    background: '#333333',
  },
};

interface GameContextType {
  gameState: GameState;
  score: number;
  highScore: number;
  sequence: ButtonColor[];
  userSequence: ButtonColor[];
  activeButton: ButtonColor | null;
  timeRemaining: number;
  maxTimePerRound: number;
  difficulty: number;
  soundEnabled: boolean;
  voiceInstructionsEnabled: boolean;
  currentTheme: ThemeId;
  startGame: () => void;
  handleButtonPress: (color: ButtonColor) => void;
  isButtonActive: (color: ButtonColor) => boolean;
  setDifficulty: (level: number) => void;
  toggleSound: () => void;
  toggleVoiceInstructions: () => void;
  changeTheme: (themeId: ThemeId) => void;
  getButtonColor: (color: ButtonColor) => string;
  getBackgroundColor: () => string;
  restartGame: () => void;
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
  const [difficulty, setDifficulty] = useState<number>(2); // 1=Easy, 2=Medium, 3=Hard
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [voiceInstructionsEnabled, setSpeechEnabled] = useState<boolean>(true);
  const [currentTheme, setCurrentTheme] = useState<ThemeId>('classic');

  const { toast } = useToast();

  // Load settings from localStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem('simonHighScore');
    const savedDifficulty = localStorage.getItem('simonDifficulty');
    const savedSound = localStorage.getItem('simonSound');
    const savedVoiceInstructions = localStorage.getItem('simonVoiceInstructions');
    const savedTheme = localStorage.getItem('simonTheme');

    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
    if (savedDifficulty) {
      setDifficulty(parseInt(savedDifficulty, 10));
    }
    if (savedSound) {
      setSoundEnabled(savedSound === 'true');
    }
    if (savedVoiceInstructions) {
      setSpeechEnabled(savedVoiceInstructions === 'true');
    }
    if (savedTheme && ['classic', 'pastel', 'neon', 'monochrome'].includes(savedTheme)) {
      setCurrentTheme(savedTheme as ThemeId);
    }
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('simonHighScore', highScore.toString());
  }, [highScore]);

  useEffect(() => {
    localStorage.setItem('simonDifficulty', difficulty.toString());
  }, [difficulty]);

  useEffect(() => {
    localStorage.setItem('simonSound', soundEnabled.toString());
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('simonVoiceInstructions', voiceInstructionsEnabled.toString());
  }, [voiceInstructionsEnabled]);

  useEffect(() => {
    localStorage.setItem('simonTheme', currentTheme);
  }, [currentTheme]);

  // Generate a random button color
  const getRandomButton = (): ButtonColor => {
    const buttons: ButtonColor[] = ['red', 'blue', 'green', 'yellow'];
    return buttons[Math.floor(Math.random() * buttons.length)];
  };

  // Calculate timing parameters based on difficulty
  const getSequenceDelay = () => {
    let baseDelay;
    switch (difficulty) {
      case 1: baseDelay = 800; break; // Easy: Slower
      case 3: baseDelay = 400; break; // Hard: Faster
      default: baseDelay = 600; break; // Medium: Normal
    }
    
    // Add extra time if voice instructions are enabled
    return voiceInstructionsEnabled ? baseDelay + 800 : baseDelay;
  };

  const getSequenceDisplayTime = () => {
    let baseTime;
    switch (difficulty) {
      case 1: baseTime = 800; break; // Easy: Longer display
      case 3: baseTime = 400; break; // Hard: Brief display
      default: baseTime = 600; break; // Medium: Normal
    }
    
    // Add extra time if voice instructions are enabled
    return voiceInstructionsEnabled ? baseTime + 800 : baseTime;
  };

  const getTimeLimit = (seqLength: number) => {
    const baseTime = difficulty === 1 
      ? 8 // Easy: More time
      : difficulty === 3 
        ? 4 // Hard: Less time
        : 6; // Medium: Standard time
    
    return Math.max(4, Math.min(10, baseTime + (seqLength * 0.5)));
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

  // Function to change difficulty
  const changeDifficulty = (level: number) => {
    if (level >= 1 && level <= 3) {
      setDifficulty(level);
      toast({
        title: `Difficulty: ${level === 1 ? 'Easy' : level === 2 ? 'Medium' : 'Hard'}`,
        description: "Game difficulty settings updated",
      });
    }
  };

  // Function to toggle sound
  const toggleSound = () => {
    setSoundEnabled(prev => !prev);
  };
  
  // Function to toggle voice instructions
  const toggleVoiceInstructions = () => {
    setSpeechEnabled(prev => !prev);
  };
  
  // Function to change theme
  const changeTheme = (themeId: ThemeId) => {
    setCurrentTheme(themeId);
    toast({
      title: "Theme Changed",
      description: `Theme set to ${themeId.charAt(0).toUpperCase() + themeId.slice(1)}`,
    });
  };

  // Get button color based on current theme
  const getButtonColor = (color: ButtonColor): string => {
    return themeColors[currentTheme][color];
  };
  
  // Get background color based on current theme
  const getBackgroundColor = (): string => {
    return themeColors[currentTheme].background;
  };

  // Start a new game
  const startGame = () => {
    // Reset game state
    setScore(0);
    setSequence([getRandomButton()]);
    setUserSequence([]);
    setCurrentStep(0);
    const initialTime = getTimeLimit(1);
    setTimeRemaining(initialTime);
    setMaxTimePerRound(initialTime);
    setGameState('sequence');
  };
  
  // Restart game after game over
  const restartGame = () => {
    startGame();
  };

  // Play the sequence for the user to watch
  useEffect(() => {
    if (gameState !== 'sequence') return;

    let step = 0;
    const sequenceDelay = getSequenceDelay();
    const displayTime = getSequenceDisplayTime();
    
    const playSequence = () => {
      // Play the current step in the sequence
      setActiveButton(sequence[step]);
      
      // After a short delay, turn off the button
      setTimeout(() => {
        setActiveButton(null);
        step++;
        
        if (step < sequence.length) {
          // Continue to the next step after a gap
          // Add extra time between steps if voice is enabled
          const pauseTime = voiceInstructionsEnabled ? sequenceDelay + 200 : sequenceDelay - displayTime;
          setTimeout(playSequence, pauseTime);
        } else {
          // Sequence is complete, user's turn
          // Set time limit based on sequence length and difficulty
          const timeLimit = getTimeLimit(sequence.length);
          setTimeRemaining(timeLimit);
          setMaxTimePerRound(timeLimit);
          setGameState('userInput');
        }
      }, displayTime);
    };

    // Start playing the sequence after a short delay
    // Add extra time before starting if voice is enabled
    const initialDelay = voiceInstructionsEnabled ? 1500 : 1000;
    const timer = setTimeout(playSequence, initialDelay);
    
    return () => clearTimeout(timer);
  }, [gameState, sequence, difficulty, voiceInstructionsEnabled]);

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
        toast({
          title: "New High Score!",
          description: `You've achieved a new personal best of ${score}!`,
        });
      }
      return;
    }

    // Check if the user completed the current sequence
    if (newUserSequence.length === sequence.length) {
      // User completed the sequence correctly
      const newScore = score + 1;
      setScore(newScore);
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
    difficulty,
    soundEnabled,
    voiceInstructionsEnabled,
    currentTheme,
    startGame,
    handleButtonPress,
    isButtonActive,
    setDifficulty: changeDifficulty,
    toggleSound,
    toggleVoiceInstructions,
    changeTheme,
    getButtonColor,
    getBackgroundColor,
    restartGame,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
