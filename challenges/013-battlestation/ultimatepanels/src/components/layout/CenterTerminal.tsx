import { useState, useEffect, useRef } from 'react';
import { Terminal, Cpu, Shield, Wifi, Activity, Zap } from 'lucide-react';

const BOOT_SEQUENCE = [
  { text: 'BATTLESTATION OS v4.2.1', delay: 100 },
  { text: 'Initializing neural interface...', delay: 300 },
  { text: '[OK] Core systems online', delay: 200 },
  { text: '[OK] Network adapter configured', delay: 150 },
  { text: '[OK] Security protocols active', delay: 180 },
  { text: '[OK] Display matrix calibrated', delay: 120 },
  { text: '', delay: 100 },
  { text: 'System ready. Welcome, Commander.', delay: 400 },
  { text: '', delay: 200 },
];

const IDLE_COMMANDS = [
  { cmd: 'scan --network', output: '42 devices detected on local network' },
  { cmd: 'status --all', output: 'All systems nominal. Uptime: 47d 12h 33m' },
  { cmd: 'metrics --cpu', output: 'CPU: 45% | Cores: 8 | Temp: 58°C' },
  { cmd: 'memory --usage', output: 'RAM: 16.4GB / 32GB (51.3% utilized)' },
  { cmd: 'disk --health', output: 'SSD: 98% health | HDD: 94% health' },
  { cmd: 'security --check', output: 'Firewall: ACTIVE | Threats blocked: 147' },
];

export function CenterTerminal() {
  const [lines, setLines] = useState<Array<{ text: string; type: 'system' | 'cmd' | 'output' }>>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isBooting, setIsBooting] = useState(true);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const bottomRef = useRef<HTMLDivElement>(null);

  // Time update
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  // Boot sequence
  useEffect(() => {
    let totalDelay = 0;

    BOOT_SEQUENCE.forEach((line, i) => {
      totalDelay += line.delay;
      setTimeout(() => {
        setLines((prev) => [...prev, { text: line.text, type: 'system' }]);
        if (i === BOOT_SEQUENCE.length - 1) {
          setTimeout(() => setIsBooting(false), 500);
        }
      }, totalDelay);
    });
  }, []);

  // Idle command simulation
  useEffect(() => {
    if (isBooting) return;

    let cmdIndex = 0;
    const runCommand = () => {
      const command = IDLE_COMMANDS[cmdIndex % IDLE_COMMANDS.length];
      cmdIndex++;

      // Type the command
      let charIndex = 0;
      const typeInterval = setInterval(() => {
        if (charIndex < command.cmd.length) {
          setCurrentInput(command.cmd.slice(0, charIndex + 1));
          charIndex++;
        } else {
          clearInterval(typeInterval);

          // Execute after typing
          setTimeout(() => {
            setLines((prev) => [
              ...prev,
              { text: '> ' + command.cmd, type: 'cmd' },
              { text: command.output, type: 'output' },
            ]);
            setCurrentInput('');
          }, 300);
        }
      }, 50);
    };

    const interval = setInterval(runCommand, 6000);
    setTimeout(runCommand, 1500); // First command after boot

    return () => clearInterval(interval);
  }, [isBooting]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour12: false });
  };

  return (
    <main className="fixed inset-0 flex items-center justify-center z-10 pointer-events-none p-6 sm:p-10 lg:p-20">
      <div className="w-full max-w-3xl h-full max-h-[70vh] md:max-h-[560px] pointer-events-auto bs-terminal-wrapper">
        {/* Outer glow frame */}
        <div className="bs-terminal-glow-frame" />

        {/* Terminal window */}
        <div className="h-full flex flex-col bs-terminal backdrop-blur-xl overflow-hidden relative">
          {/* Scanline overlay */}
          <div className="bs-terminal-scanlines" />

          {/* Holographic shimmer */}
          <div className="bs-terminal-hologram" />

          {/* Corner accents */}
          <div className="bs-terminal-corner bs-terminal-corner-tl" />
          <div className="bs-terminal-corner bs-terminal-corner-tr" />
          <div className="bs-terminal-corner bs-terminal-corner-bl" />
          <div className="bs-terminal-corner bs-terminal-corner-br" />

          {/* Ambient glow overlay */}
          <div className="bs-terminal-ambient" />

          {/* Header bar */}
          <div className="bs-terminal-header relative z-10">
            {/* Header glow line */}
            <div className="bs-terminal-header-glow" />

            <div className="flex items-center gap-3 px-5 py-3">
              {/* Window controls with glow */}
              <div className="flex gap-2.5">
                <div className="bs-terminal-dot bs-terminal-dot-red" />
                <div className="bs-terminal-dot bs-terminal-dot-yellow" />
                <div className="bs-terminal-dot bs-terminal-dot-green" />
              </div>

              {/* Terminal title */}
              <div className="flex items-center gap-2.5 ml-2">
                <div className="bs-terminal-icon">
                  <Terminal className="w-4 h-4" />
                </div>
                <span className="bs-terminal-title">COMMAND CENTER</span>
              </div>

              <div className="flex-1" />

              {/* Status indicators */}
              <div className="flex items-center gap-3">
                <div className="bs-terminal-status-group">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="bs-terminal-status-value">45%</span>
                </div>
                <div className="bs-terminal-status-group">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="bs-terminal-status-value">OK</span>
                </div>
                <div className="bs-terminal-status-group">
                  <Shield className="w-3.5 h-3.5 text-violet-400" />
                  <span className="bs-terminal-status-value">SEC</span>
                </div>
                <div className="bs-terminal-badge bs-terminal-badge-primary">
                  <Zap className="w-3 h-3" />
                  <span>MAIN</span>
                </div>
              </div>
            </div>

            {/* Circuit line accent */}
            <div className="bs-terminal-circuit" />
          </div>

          {/* Terminal content */}
          <div className="flex-1 overflow-auto p-5 font-mono text-sm bs-terminal-content relative z-10">
            {/* CRT vignette effect */}
            <div className="bs-terminal-vignette" />

            {lines.map((line, i) => (
              <div
                key={i}
                className={`bs-terminal-line ${
                  line.type === 'system'
                    ? line.text.startsWith('[OK]')
                      ? 'bs-terminal-line-success'
                      : line.text.includes('Welcome')
                        ? 'bs-terminal-line-welcome'
                        : 'bs-terminal-line-system'
                    : line.type === 'cmd'
                    ? 'bs-terminal-line-cmd'
                    : 'bs-terminal-line-output'
                } ${line.text === '' ? 'h-4' : ''}`}
              >
                {line.text}
              </div>
            ))}

            {/* Current input line with animated cursor */}
            {!isBooting && (
              <div className="bs-terminal-input-line">
                <span className="bs-terminal-prompt">&gt;</span>
                <span className="bs-terminal-input">{currentInput}</span>
                <span className={`bs-terminal-cursor ${cursorVisible ? 'bs-terminal-cursor-visible' : 'bs-terminal-cursor-hidden'}`} />
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Status bar */}
          <div className="bs-terminal-statusbar relative z-10">
            <div className="bs-terminal-statusbar-glow" />

            <div className="flex items-center justify-between px-5 py-2.5">
              <div className="flex items-center gap-5">
                <span className="bs-terminal-status-indicator">
                  <span className="bs-terminal-status-dot" />
                  <span className="bs-terminal-status-text">CONNECTED</span>
                </span>
                <span className="bs-terminal-status-item">
                  <Wifi className="w-3 h-3 text-cyan-500" />
                  <span>SECURE</span>
                </span>
                <span className="bs-terminal-status-item">UTF-8</span>
                <span className="bs-terminal-status-item">LF</span>
              </div>

              <div className="flex items-center gap-4">
                <span className="bs-terminal-time">{formatTime(currentTime)}</span>
                <span className="bs-terminal-hint">
                  <kbd>ESC</kbd> close panels
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
