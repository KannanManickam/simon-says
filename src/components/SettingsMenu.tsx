
import React from 'react';
import { Settings, Volume2, VolumeX, Palette, Mic, MicOff } from 'lucide-react';
import { useGame } from '@/context/GameContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeId } from '@/context/GameContext';

const SettingsMenu: React.FC = () => {
  const { 
    difficulty, 
    setDifficulty, 
    soundEnabled,
    toggleSound,
    voiceInstructionsEnabled,
    toggleVoiceInstructions,
    currentTheme,
    changeTheme
  } = useGame();
  
  const themes = [
    { id: 'classic' as ThemeId, name: 'Classic', colors: ['#FF4136', '#0074D9', '#2ECC40', '#FFDC00'] },
    { id: 'pastel' as ThemeId, name: 'Pastel', colors: ['#FFB3B3', '#B3D9FF', '#B3FFB3', '#FFFFB3'] },
    { id: 'neon' as ThemeId, name: 'Neon', colors: ['#FF00FF', '#00FFFF', '#00FF00', '#FFFF00'] },
    { id: 'monochrome' as ThemeId, name: 'Monochrome', colors: ['#555555', '#777777', '#999999', '#BBBBBB'] },
  ];
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full bg-slate-700 border-slate-600 hover:bg-slate-600">
          <Settings className="h-5 w-5 text-slate-200" />
          <span className="sr-only">Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-slate-800 text-white border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-xl text-center text-white">Game Settings</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="difficulty" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-700">
            <TabsTrigger value="difficulty">Difficulty</TabsTrigger>
            <TabsTrigger value="audio">Audio</TabsTrigger>
            <TabsTrigger value="themes">Themes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="difficulty" className="p-4">
            <div className="space-y-6">
              <div>
                <h3 className="mb-3 text-lg font-medium">Difficulty Level</h3>
                <Slider 
                  value={[difficulty]} 
                  min={1} 
                  max={3}
                  step={1}
                  onValueChange={(vals) => setDifficulty(vals[0])}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-slate-400">
                  <span>Easy</span>
                  <span>Medium</span>
                  <span>Hard</span>
                </div>
              </div>
              
              <div className="text-sm opacity-80">
                <p className="mb-2">
                  <strong>Easy:</strong> Slower sequence, longer time to respond
                </p>
                <p className="mb-2">
                  <strong>Medium:</strong> Standard speed and timing
                </p>
                <p>
                  <strong>Hard:</strong> Faster sequence, less time to respond
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="audio" className="p-4">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {soundEnabled ? (
                    <Volume2 className="h-5 w-5 text-slate-200" />
                  ) : (
                    <VolumeX className="h-5 w-5 text-slate-400" />
                  )}
                  <Label htmlFor="sound-toggle" className="text-lg">Sound Effects</Label>
                </div>
                <Switch 
                  id="sound-toggle" 
                  checked={soundEnabled}
                  onCheckedChange={toggleSound}
                />
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  {voiceInstructionsEnabled ? (
                    <Mic className="h-5 w-5 text-slate-200" />
                  ) : (
                    <MicOff className="h-5 w-5 text-slate-400" />
                  )}
                  <Label htmlFor="voice-toggle" className="text-lg">Voice Instructions</Label>
                </div>
                <Switch 
                  id="voice-toggle" 
                  checked={voiceInstructionsEnabled}
                  onCheckedChange={toggleVoiceInstructions}
                />
              </div>
              
              <p className="text-sm opacity-80 mt-2">
                Enable voice that announces "Simon says" and the color names
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="themes" className="p-4">
            <div className="space-y-4">
              <h3 className="mb-3 text-lg font-medium flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Color Theme
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    className={`p-3 rounded-lg border transition-all ${
                      currentTheme === theme.id 
                        ? 'border-white shadow-lg scale-105' 
                        : 'border-slate-600 opacity-80 hover:opacity-100'
                    }`}
                    onClick={() => changeTheme(theme.id)}
                  >
                    <div className="flex justify-between mb-2">
                      {theme.colors.map((color, idx) => (
                        <div 
                          key={idx}
                          className="w-6 h-6 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <div className="text-center text-sm">{theme.name}</div>
                  </button>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsMenu;
