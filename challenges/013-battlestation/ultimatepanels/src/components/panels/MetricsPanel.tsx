import { useState, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { springConfigs } from '../../config/springs';

interface MetricBarProps {
  label: string;
  value: number;
  max: number;
  color: string;
  unit?: string;
}

function MetricBar({ label, value, max, color, unit = '' }: MetricBarProps) {
  const percentage = (value / max) * 100;

  const spring = useSpring({
    width: `${percentage}%`,
    config: springConfigs.smooth,
  });

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-slate-400">{label}</span>
        <span className="text-white font-mono">
          {value.toLocaleString()}
          {unit && <span className="text-slate-500 ml-1">{unit}</span>}
        </span>
      </div>
      <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
        <animated.div
          style={{
            ...spring,
            backgroundColor: color,
            boxShadow: `0 0 10px ${color}`,
          }}
          className="h-full rounded-full"
        />
      </div>
    </div>
  );
}

interface SparklineProps {
  data: number[];
  color: string;
  height?: number;
}

function Sparkline({ data, color, height = 40 }: SparklineProps) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data
    .map((value, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg className="w-full" height={height} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polygon
        points={`0,${height} ${points} 100,${height}`}
        fill={`url(#gradient-${color})`}
      />
    </svg>
  );
}

export function MetricsPanel() {
  const [metrics, setMetrics] = useState({
    requests: 12847,
    latency: 42,
    errors: 23,
    uptime: 99.97,
  });

  const [history, setHistory] = useState({
    requests: Array(20).fill(0).map(() => Math.random() * 1000 + 500),
    latency: Array(20).fill(0).map(() => Math.random() * 30 + 20),
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((m) => ({
        requests: m.requests + Math.floor(Math.random() * 50),
        latency: Math.max(10, Math.min(100, m.latency + (Math.random() - 0.5) * 10)),
        errors: m.errors + (Math.random() > 0.9 ? 1 : 0),
        uptime: Math.max(99, Math.min(100, m.uptime + (Math.random() - 0.5) * 0.01)),
      }));

      setHistory((h) => ({
        requests: [...h.requests.slice(1), Math.random() * 1000 + 500],
        latency: [...h.latency.slice(1), Math.random() * 30 + 20],
      }));
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Key metrics */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Requests', value: metrics.requests.toLocaleString(), color: '#06b6d4' },
          { label: 'Latency', value: `${Math.round(metrics.latency)}ms`, color: '#8b5cf6' },
          { label: 'Errors', value: metrics.errors.toString(), color: '#f43f5e' },
          { label: 'Uptime', value: `${metrics.uptime.toFixed(2)}%`, color: '#10b981' },
        ].map((metric, i) => (
          <div
            key={i}
            className="bg-white/5 rounded-lg p-3 border border-white/5"
          >
            <div className="text-xs text-slate-500">{metric.label}</div>
            <div className="text-xl font-mono font-bold text-white mt-1" style={{ color: metric.color }}>
              {metric.value}
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-black/20 rounded-lg p-4 border border-cyan-500/10">
          <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-3">Requests / min</h4>
          <Sparkline data={history.requests} color="#06b6d4" height={60} />
        </div>
        <div className="bg-black/20 rounded-lg p-4 border border-violet-500/10">
          <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-3">Latency (ms)</h4>
          <Sparkline data={history.latency} color="#8b5cf6" height={60} />
        </div>
      </div>

      {/* Resource bars */}
      <div className="space-y-4 bg-white/5 rounded-lg p-4 border border-white/5">
        <h4 className="text-xs text-slate-500 uppercase tracking-wider">Resource Usage</h4>
        <MetricBar label="CPU" value={67} max={100} color="#06b6d4" unit="%" />
        <MetricBar label="Memory" value={12.4} max={32} color="#8b5cf6" unit="GB" />
        <MetricBar label="Disk I/O" value={342} max={500} color="#10b981" unit="MB/s" />
        <MetricBar label="Network" value={847} max={1000} color="#f59e0b" unit="Mbps" />
      </div>
    </div>
  );
}
