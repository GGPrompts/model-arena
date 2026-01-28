import { useState, useEffect, useRef } from 'react';

const COMMANDS = [
  { cmd: 'system status', output: 'All systems operational. Uptime: 47d 12h 33m' },
  { cmd: 'network scan', output: 'Scanning... 42 devices found on network' },
  { cmd: 'memory check', output: 'RAM: 16.4GB / 32GB (51.3% utilized)' },
  { cmd: 'cpu temp', output: 'Core 0: 58°C | Core 1: 56°C | Core 2: 59°C | Core 3: 57°C' },
  { cmd: 'disk usage', output: 'SSD: 847GB / 2TB (42.4%) | HDD: 3.2TB / 8TB (40.0%)' },
];

export function TerminalPanel() {
  const [history, setHistory] = useState<Array<{ type: 'cmd' | 'output'; text: string }>>([]);
  const [currentCmd, setCurrentCmd] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-type demo commands
    let cmdIndex = 0;
    let charIndex = 0;
    let isOutput = false;

    const typeInterval = setInterval(() => {
      if (cmdIndex >= COMMANDS.length) {
        cmdIndex = 0;
        return;
      }

      const command = COMMANDS[cmdIndex];

      if (!isOutput) {
        setIsTyping(true);
        if (charIndex < command.cmd.length) {
          setCurrentCmd(command.cmd.slice(0, charIndex + 1));
          charIndex++;
        } else {
          // Command complete, show it in history
          setHistory((h) => [...h, { type: 'cmd', text: '> ' + command.cmd }]);
          setCurrentCmd('');
          isOutput = true;
          charIndex = 0;
        }
      } else {
        // Show output
        setIsTyping(false);
        setHistory((h) => [...h, { type: 'output', text: command.output }]);
        isOutput = false;
        cmdIndex++;
        charIndex = 0;
      }
    }, 80);

    return () => clearInterval(typeInterval);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  return (
    <div className="h-full flex flex-col bg-black/30 rounded-lg border border-emerald-500/20 font-mono text-sm">
      {/* Terminal header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-emerald-500/20">
        <div className="w-3 h-3 rounded-full bg-red-500/80" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <div className="w-3 h-3 rounded-full bg-green-500/80" />
        <span className="ml-2 text-xs text-slate-500">battlestation@localhost</span>
      </div>

      {/* Terminal content */}
      <div className="flex-1 overflow-auto p-3 space-y-1">
        {history.map((line, i) => (
          <div
            key={i}
            className={line.type === 'cmd' ? 'text-emerald-400' : 'text-slate-400'}
          >
            {line.text}
          </div>
        ))}

        {/* Current typing line */}
        <div className="flex items-center text-emerald-400">
          <span className="text-emerald-600">{'>'}</span>
          <span className="ml-1">{currentCmd}</span>
          <span
            className={`ml-0.5 w-2 h-4 bg-emerald-400 ${isTyping ? 'animate-pulse' : 'animate-[pulse_1s_step-end_infinite]'}`}
          />
        </div>

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
