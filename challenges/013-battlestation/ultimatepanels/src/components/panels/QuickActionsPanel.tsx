import { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import {
  Rocket,
  RefreshCw,
  Download,
  Upload,
  Shield,
  Zap,
  Database,
  Globe,
  Terminal,
  Cpu,
  HardDrive,
  Wifi,
} from 'lucide-react';
import { springConfigs } from '../../config/springs';

interface ActionButtonProps {
  icon: React.ElementType;
  label: string;
  color: string;
  onClick?: () => void;
}

function ActionButton({ icon: Icon, label, color, onClick }: ActionButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const spring = useSpring({
    scale: isPressed ? 0.92 : isHovered ? 1.05 : 1,
    config: springConfigs.bouncy,
  });

  const glowSpring = useSpring({
    opacity: isHovered ? 0.3 : 0,
    config: springConfigs.stiff,
  });

  return (
    <animated.button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      style={{ scale: spring.scale }}
      className="relative flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 transition-colors"
    >
      {/* Glow effect */}
      <animated.div
        style={{
          opacity: glowSpring.opacity,
          background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
        }}
        className="absolute inset-0 rounded-xl"
      />

      <div
        className="relative w-10 h-10 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: `${color}20` }}
      >
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <span className="relative text-xs text-slate-300">{label}</span>
    </animated.button>
  );
}

export function QuickActionsPanel() {
  const actions = [
    { icon: Rocket, label: 'Deploy', color: '#10b981' },
    { icon: RefreshCw, label: 'Sync', color: '#06b6d4' },
    { icon: Download, label: 'Backup', color: '#8b5cf6' },
    { icon: Upload, label: 'Restore', color: '#f59e0b' },
    { icon: Shield, label: 'Security', color: '#f43f5e' },
    { icon: Zap, label: 'Optimize', color: '#eab308' },
    { icon: Database, label: 'Database', color: '#06b6d4' },
    { icon: Globe, label: 'Network', color: '#10b981' },
    { icon: Terminal, label: 'Console', color: '#a855f7' },
    { icon: Cpu, label: 'Process', color: '#ec4899' },
    { icon: HardDrive, label: 'Storage', color: '#f97316' },
    { icon: Wifi, label: 'Connect', color: '#14b8a6' },
  ];

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search actions..."
          className="w-full px-4 py-2.5 rounded-lg bg-black/30 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500/50"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-slate-700/50 text-xs text-slate-500">
          /
        </kbd>
      </div>

      {/* Action grid */}
      <div className="grid grid-cols-4 gap-2">
        {actions.map((action, i) => (
          <ActionButton key={i} {...action} />
        ))}
      </div>

      {/* Recent actions */}
      <div>
        <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Recent</h4>
        <div className="space-y-1">
          {[
            { action: 'Deploy', time: '2 min ago', status: 'success' },
            { action: 'Backup', time: '1 hour ago', status: 'success' },
            { action: 'Sync', time: '3 hours ago', status: 'warning' },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/5"
            >
              <span className="text-sm text-slate-300">{item.action}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">{item.time}</span>
                <div
                  className={`w-2 h-2 rounded-full ${
                    item.status === 'success' ? 'bg-emerald-400' : 'bg-amber-400'
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
