
// Sound frequencies for each button
const SOUND_FREQUENCIES = {
  red: 329.63, // E4
  blue: 261.63, // C4
  green: 392.00, // G4
  yellow: 196.00, // G3
};

type ButtonColor = 'red' | 'blue' | 'green' | 'yellow';

let audioContext: AudioContext | null = null;

// Initialize the audio context (must be triggered by a user interaction)
export const initAudio = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

// Play a tone for a specific button
export const playTone = (color: ButtonColor, duration: number = 300) => {
  try {
    const context = initAudio();
    
    // Create an oscillator
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    
    // Set oscillator type and frequency
    oscillator.type = 'sine';
    oscillator.frequency.value = SOUND_FREQUENCIES[color];
    
    // Connect the nodes
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    
    // Shape the sound with an envelope
    gainNode.gain.value = 0;
    gainNode.gain.setValueAtTime(0, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, context.currentTime + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, context.currentTime + duration / 1000);
    
    // Start and stop the oscillator
    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + duration / 1000);
    
    return oscillator;
  } catch (error) {
    console.error('Error playing tone:', error);
    return null;
  }
};

// Play an error sound
export const playErrorSound = () => {
  try {
    const context = initAudio();
    
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.value = 130.81; // C3
    
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    
    gainNode.gain.value = 0;
    gainNode.gain.setValueAtTime(0, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, context.currentTime + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, context.currentTime + 0.3);
    
    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 0.3);
    
    setTimeout(() => {
      const oscillator2 = context.createOscillator();
      const gainNode2 = context.createGain();
      
      oscillator2.type = 'sawtooth';
      oscillator2.frequency.value = 98.00; // G2
      
      oscillator2.connect(gainNode2);
      gainNode2.connect(context.destination);
      
      gainNode2.gain.value = 0;
      gainNode2.gain.setValueAtTime(0, context.currentTime);
      gainNode2.gain.linearRampToValueAtTime(0.3, context.currentTime + 0.01);
      gainNode2.gain.linearRampToValueAtTime(0, context.currentTime + 0.5);
      
      oscillator2.start(context.currentTime);
      oscillator2.stop(context.currentTime + 0.5);
    }, 300);
    
  } catch (error) {
    console.error('Error playing error sound:', error);
  }
};
