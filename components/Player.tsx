import React, { useState, useRef, useEffect } from 'react';

interface PlayerProps {
  currentSong: any;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
}

const Player: React.FC<PlayerProps> = ({ currentSong, isPlaying, setIsPlaying }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSong]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress((current / duration) * 100);
    }
  };

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 text-white p-4 border-t border-zinc-800 flex items-center justify-between px-6 h-24">
      {/* Song Info */}
      <div className="flex items-center w-1/3">
        <img src={currentSong.cover} alt={currentSong.title} className="w-14 h-14 rounded shadow-lg mr-4" />
        <div>
          <div className="font-medium truncate">{currentSong.title}</div>
          <div className="text-xs text-zinc-400 truncate">{currentSong.artist}</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center w-1/3">
        <div className="flex items-center space-x-6 mb-2">
          <button className="text-zinc-400 hover:text-white transition">⏮</button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="bg-white text-black rounded-full w-10 h-10 flex items-center justify-center font-bold hover:scale-105 transition"
          >
            {isPlaying ? '⏸' : '▶️'}
          </button>
          <button className="text-zinc-400 hover:text-white transition">⏭</button>
        </div>
        <div className="w-full max-w-md bg-zinc-700 h-1 rounded-full overflow-hidden">
          <div
            className="bg-green-500 h-full transition-all duration-100"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Volume/Extras */}
      <div className="flex items-center justify-end w-1/3 text-zinc-400">
        <span className="text-xs mr-2">Vol</span>
        <input type="range" className="w-24 accent-green-500" />
      </div>

      <audio
        ref={audioRef}
        src={currentSong.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  );
};

export default Player;
