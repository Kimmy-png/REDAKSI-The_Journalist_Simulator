import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface BackgroundMusicProps {
  isGameStarted: boolean;
}

export const BackgroundMusic: React.FC<BackgroundMusicProps> = ({ isGameStarted }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const attemptPlay = () => {
    if (audioRef.current && !isMuted && !isPlaying) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setIsPlaying(true);
        }).catch(error => {
          console.log("Autoplay blocked. Waiting for interaction.");
        });
      }
    }
  };

  useEffect(() => {
    attemptPlay();

    // Browser autoplay policy often requires a user interaction
    const handleInteraction = () => {
      attemptPlay();
      if (isPlaying) {
        window.removeEventListener('click', handleInteraction);
        window.removeEventListener('keydown', handleInteraction);
      }
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('keydown', handleInteraction);

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, [isMuted, isPlaying]);

  const toggleMute = () => {
    if (audioRef.current) {
      const newMuted = !isMuted;
      audioRef.current.muted = newMuted;
      setIsMuted(newMuted);
      if (!newMuted) {
        attemptPlay();
      }
    }
  };

  return (
    <div className="flex items-center gap-2 px-2">
      <audio
        ref={audioRef}
        src="/audio/bg_music.mp3"
        loop
      />
      <button
        onClick={toggleMute}
        className="win-button border-outset p-1 flex items-center justify-center hover:bg-gray-100 active:border-inset"
        title={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? <VolumeX size={14} className="text-red-700" /> : <Volume2 size={14} className="text-blue-700" />}
      </button>
    </div>
  );
};
