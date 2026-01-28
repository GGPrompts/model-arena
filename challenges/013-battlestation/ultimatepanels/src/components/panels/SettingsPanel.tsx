import { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { springConfigs } from '../../config/springs';

interface ToggleProps {
  label: string;
  description?: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  color?: string;
}

function Toggle({ label, description, enabled, onChange, color = '#06b6d4' }: ToggleProps) {
  const spring = useSpring({
    x: enabled ? 20 : 0,
    backgroundColor: enabled ? color : '#475569',
    config: springConfigs.bouncy,
  });

  return (
    <button
      onClick={() => onChange(!enabled)}
      className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors text-left"
    >
      <div>
        <div className="text-sm text-white">{label}</div>
        {description && <div className="text-xs text-slate-500 mt-0.5">{description}</div>}
      </div>

      <animated.div
        style={{ backgroundColor: spring.backgroundColor }}
        className="w-11 h-6 rounded-full p-0.5 cursor-pointer"
      >
        <animated.div
          style={{ x: spring.x }}
          className="w-5 h-5 rounded-full bg-white shadow-sm"
        />
      </animated.div>
    </button>
  );
}

interface SliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  color?: string;
}

function Slider({ label, value, onChange, min = 0, max = 100, color = '#8b5cf6' }: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="p-3">
      <div className="flex justify-between mb-2">
        <span className="text-sm text-white">{label}</span>
        <span className="text-sm text-slate-400 font-mono">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, ${color} ${percentage}%, #334155 ${percentage}%)`,
        }}
      />
    </div>
  );
}

export function SettingsPanel() {
  const [settings, setSettings] = useState({
    notifications: true,
    soundEffects: true,
    animations: true,
    autoUpdate: false,
    darkMode: true,
    compactMode: false,
    brightness: 75,
    volume: 60,
    refreshRate: 144,
  });

  const updateSetting = <K extends keyof typeof settings>(key: K, value: typeof settings[K]) => {
    setSettings((s) => ({ ...s, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* General section */}
      <section>
        <h3 className="text-xs text-slate-500 uppercase tracking-wider mb-2 px-3">General</h3>
        <div className="space-y-1 bg-white/5 rounded-lg border border-white/5">
          <Toggle
            label="Notifications"
            description="Show system notifications"
            enabled={settings.notifications}
            onChange={(v) => updateSetting('notifications', v)}
            color="#06b6d4"
          />
          <Toggle
            label="Sound Effects"
            description="Play sounds on interactions"
            enabled={settings.soundEffects}
            onChange={(v) => updateSetting('soundEffects', v)}
            color="#10b981"
          />
          <Toggle
            label="Animations"
            description="Enable UI animations"
            enabled={settings.animations}
            onChange={(v) => updateSetting('animations', v)}
            color="#8b5cf6"
          />
        </div>
      </section>

      {/* Appearance section */}
      <section>
        <h3 className="text-xs text-slate-500 uppercase tracking-wider mb-2 px-3">Appearance</h3>
        <div className="space-y-1 bg-white/5 rounded-lg border border-white/5">
          <Toggle
            label="Dark Mode"
            enabled={settings.darkMode}
            onChange={(v) => updateSetting('darkMode', v)}
            color="#f59e0b"
          />
          <Toggle
            label="Compact Mode"
            description="Reduce padding and spacing"
            enabled={settings.compactMode}
            onChange={(v) => updateSetting('compactMode', v)}
            color="#f43f5e"
          />
          <Slider
            label="Brightness"
            value={settings.brightness}
            onChange={(v) => updateSetting('brightness', v)}
            color="#f59e0b"
          />
        </div>
      </section>

      {/* System section */}
      <section>
        <h3 className="text-xs text-slate-500 uppercase tracking-wider mb-2 px-3">System</h3>
        <div className="space-y-1 bg-white/5 rounded-lg border border-white/5">
          <Toggle
            label="Auto Update"
            description="Automatically install updates"
            enabled={settings.autoUpdate}
            onChange={(v) => updateSetting('autoUpdate', v)}
            color="#06b6d4"
          />
          <Slider
            label="Volume"
            value={settings.volume}
            onChange={(v) => updateSetting('volume', v)}
            color="#8b5cf6"
          />
          <Slider
            label="Refresh Rate"
            value={settings.refreshRate}
            onChange={(v) => updateSetting('refreshRate', v)}
            min={60}
            max={240}
            color="#10b981"
          />
        </div>
      </section>
    </div>
  );
}
