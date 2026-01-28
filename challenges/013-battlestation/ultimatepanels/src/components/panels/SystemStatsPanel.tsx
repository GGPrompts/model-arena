import { useSpring, animated } from '@react-spring/web';
import { useState, useEffect } from 'react';
import { springConfigs } from '../../config/springs';

interface GaugeProps {
  label: string;
  value: number;
  max: number;
  color: string;
  unit?: string;
}

function AnimatedGauge({ label, value, max, color, unit = '%' }: GaugeProps) {
  const percentage = (value / max) * 100;

  const spring = useSpring({
    value: percentage,
    config: springConfigs.smooth,
  });

  const circumference = 2 * Math.PI * 40;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        {/* Background circle */}
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="48"
            cy="48"
            r="40"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-slate-700/50"
          />
          <animated.circle
            cx="48"
            cy="48"
            r="40"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={spring.value.to((v) => circumference - (v / 100) * circumference)}
            style={{
              filter: `drop-shadow(0 0 6px ${color})`,
            }}
          />
        </svg>

        {/* Value display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <animated.span className="text-xl font-bold text-white font-mono">
            {spring.value.to((v) => Math.round((v / 100) * max))}
          </animated.span>
          <span className="text-xs text-slate-500">{unit}</span>
        </div>
      </div>
      <span className="mt-2 text-sm text-slate-400">{label}</span>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  trend?: 'up' | 'down';
  color: string;
}

function StatCard({ label, value, trend, color }: StatCardProps) {
  return (
    <div className="bg-white/5 rounded-lg p-3 border border-white/5">
      <div className="text-xs text-slate-500 uppercase tracking-wider">{label}</div>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-lg font-mono font-bold text-white">{value}</span>
        {trend && (
          <span className={trend === 'up' ? 'text-emerald-400' : 'text-rose-400'}>
            {trend === 'up' ? '↑' : '↓'}
          </span>
        )}
      </div>
      <div className="mt-2 h-1 rounded-full bg-slate-700/50 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${Math.random() * 40 + 30}%`,
            backgroundColor: color,
            boxShadow: `0 0 8px ${color}`,
          }}
        />
      </div>
    </div>
  );
}

export function SystemStatsPanel() {
  const [stats, setStats] = useState({
    cpu: 45,
    memory: 68,
    gpu: 32,
    network: 15,
  });

  // Simulate changing stats
  useEffect(() => {
    const interval = setInterval(() => {
      setStats({
        cpu: Math.min(100, Math.max(20, stats.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.min(100, Math.max(40, stats.memory + (Math.random() - 0.5) * 5)),
        gpu: Math.min(100, Math.max(10, stats.gpu + (Math.random() - 0.5) * 15)),
        network: Math.min(100, Math.max(5, stats.network + (Math.random() - 0.5) * 20)),
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [stats]);

  return (
    <div className="space-y-6">
      {/* Gauges */}
      <div className="grid grid-cols-4 gap-4">
        <AnimatedGauge label="CPU" value={stats.cpu} max={100} color="#06b6d4" />
        <AnimatedGauge label="Memory" value={stats.memory} max={100} color="#8b5cf6" />
        <AnimatedGauge label="GPU" value={stats.gpu} max={100} color="#10b981" />
        <AnimatedGauge label="Network" value={stats.network} max={100} color="#f59e0b" unit="MB/s" />
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Processes" value="142" trend="up" color="#06b6d4" />
        <StatCard label="Threads" value="1,847" color="#8b5cf6" />
        <StatCard label="Uptime" value="47d 12h" color="#10b981" />
        <StatCard label="Temperature" value="58°C" trend="down" color="#f59e0b" />
      </div>
    </div>
  );
}
