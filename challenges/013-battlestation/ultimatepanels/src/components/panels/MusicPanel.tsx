import { useState, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { springConfigs } from '../../config/springs';

const TRACKS = [
  { title: 'Neon Dreams', artist: 'Synthwave Collective', duration: '4:32' },
  { title: 'Midnight Drive', artist: 'RetroFuture', duration: '3:58' },
  { title: 'Electric Pulse', artist: 'Digital Horizon', duration: '5:12' },
  { title: 'Chrome Heart', artist: 'Cyber Symphony', duration: '4:07' },
  { title: 'Binary Sunset', artist: 'Grid Runner', duration: '6:23' },
];

export function MusicPanel() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [progress, setProgress] = useState(35);

  const progressSpring = useSpring({
    width: `${progress}%`,
    config: springConfigs.smooth,
  });

  const albumSpring = useSpring({
    rotate: isPlaying ? 360 : 0,
    config: { duration: 3000 },
    loop: isPlaying,
  });

  // Simulate progress
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          setCurrentTrack((t) => (t + 1) % TRACKS.length);
          return 0;
        }
        return p + 0.5;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const track = TRACKS[currentTrack];

  return (
    <div className="space-y-6">
      {/* Now Playing */}
      <div className="flex gap-5">
        {/* Album art */}
        <animated.div
          style={{ rotate: albumSpring.rotate }}
          className="w-28 h-28 rounded-lg bg-gradient-to-br from-violet-600 via-fuchsia-500 to-pink-500 flex items-center justify-center shadow-lg shadow-violet-500/30"
        >
          <div className="w-8 h-8 rounded-full bg-slate-900/80 border-4 border-slate-700" />
        </animated.div>

        {/* Track info */}
        <div className="flex-1 flex flex-col justify-center">
          <h3 className="text-lg font-semibold text-white">{track.title}</h3>
          <p className="text-sm text-slate-400">{track.artist}</p>

          {/* Progress bar */}
          <div className="mt-4 space-y-1">
            <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
              <animated.div
                style={progressSpring}
                className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full"
              />
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>{Math.floor(progress * 2.72 / 60)}:{String(Math.floor((progress * 2.72) % 60)).padStart(2, '0')}</span>
              <span>{track.duration}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => setCurrentTrack((t) => (t - 1 + TRACKS.length) % TRACKS.length)}
          className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <SkipBack className="w-5 h-5" />
        </button>

        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-4 rounded-full bg-violet-500 hover:bg-violet-400 text-white shadow-lg shadow-violet-500/30 transition-colors"
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
        </button>

        <button
          onClick={() => setCurrentTrack((t) => (t + 1) % TRACKS.length)}
          className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <SkipForward className="w-5 h-5" />
        </button>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-3 px-4">
        <Volume2 className="w-4 h-4 text-slate-500" />
        <div className="flex-1 h-1 bg-slate-700/50 rounded-full overflow-hidden">
          <div className="w-3/4 h-full bg-slate-400 rounded-full" />
        </div>
      </div>

      {/* Playlist */}
      <div className="space-y-1">
        <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Up Next</h4>
        {TRACKS.map((t, i) => (
          <button
            key={i}
            onClick={() => {
              setCurrentTrack(i);
              setProgress(0);
            }}
            className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors ${
              i === currentTrack ? 'bg-violet-500/20 border border-violet-500/30' : 'hover:bg-white/5'
            }`}
          >
            <div
              className={`w-8 h-8 rounded flex items-center justify-center text-xs font-mono ${
                i === currentTrack ? 'bg-violet-500 text-white' : 'bg-slate-700/50 text-slate-400'
              }`}
            >
              {i + 1}
            </div>
            <div className="flex-1 text-left">
              <div className={`text-sm ${i === currentTrack ? 'text-white' : 'text-slate-300'}`}>
                {t.title}
              </div>
              <div className="text-xs text-slate-500">{t.artist}</div>
            </div>
            <span className="text-xs text-slate-500">{t.duration}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
