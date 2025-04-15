
import React from 'react';
import { Smile, Frown, User } from 'lucide-react';

type AvatarMood = 'neutral' | 'happy' | 'sad';

interface AvatarProps {
  mood: AvatarMood;
}

const Avatar: React.FC<AvatarProps> = ({ mood }) => {
  const getIcon = () => {
    switch (mood) {
      case 'happy':
        return <Smile className="text-green-500 animate-bounce" />;
      case 'sad':
        return <Frown className="text-red-500 animate-bounce" />;
      default:
        return <User className="text-gray-400" />;
    }
  };

  return (
    <div className="fixed top-4 left-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center shadow-lg">
      {getIcon()}
    </div>
  );
};

export default Avatar;
