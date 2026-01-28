import { useState } from 'react';
import { useTransition, animated } from '@react-spring/web';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';
import { springConfigs } from '../../config/springs';

interface Notification {
  id: number;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  time: string;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 1, type: 'success', title: 'Build Complete', message: 'Project compiled successfully in 2.4s', time: '2m ago' },
  { id: 2, type: 'error', title: 'Connection Lost', message: 'Failed to connect to remote server', time: '5m ago' },
  { id: 3, type: 'warning', title: 'High Memory Usage', message: 'Memory usage exceeded 80% threshold', time: '12m ago' },
  { id: 4, type: 'info', title: 'Update Available', message: 'Version 2.4.1 is ready to install', time: '1h ago' },
  { id: 5, type: 'success', title: 'Sync Complete', message: 'All files synchronized with cloud', time: '2h ago' },
];

const typeConfig = {
  success: {
    icon: CheckCircle,
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    iconColor: 'text-emerald-400',
  },
  error: {
    icon: AlertCircle,
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    iconColor: 'text-rose-400',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    iconColor: 'text-amber-400',
  },
  info: {
    icon: Info,
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    iconColor: 'text-cyan-400',
  },
};

export function NotificationsPanel() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const dismiss = (id: number) => {
    setNotifications((n) => n.filter((item) => item.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const transitions = useTransition(notifications, {
    keys: (item) => item.id,
    from: { opacity: 0, x: 50, height: 0 },
    enter: { opacity: 1, x: 0, height: 88 },
    leave: { opacity: 0, x: -50, height: 0 },
    config: springConfigs.snap,
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400">
            {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
          </span>
          {notifications.length > 0 && (
            <span className="px-1.5 py-0.5 text-xs rounded-full bg-rose-500/20 text-rose-400">
              {notifications.filter((n) => n.type === 'error').length} errors
            </span>
          )}
        </div>
        {notifications.length > 0 && (
          <button
            onClick={clearAll}
            className="text-xs text-slate-500 hover:text-white transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Notification list */}
      <div className="space-y-2 overflow-hidden">
        {transitions((style, item) => {
          const config = typeConfig[item.type];
          const Icon = config.icon;

          return (
            <animated.div
              style={style}
              className={`relative p-3 rounded-lg border ${config.bg} ${config.border}`}
            >
              <div className="flex gap-3">
                <Icon className={`w-5 h-5 mt-0.5 ${config.iconColor}`} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-medium text-white">{item.title}</h4>
                    <span className="text-xs text-slate-500 whitespace-nowrap">{item.time}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">{item.message}</p>
                </div>

                <button
                  onClick={() => dismiss(item.id)}
                  className="p-1 rounded hover:bg-white/10 text-slate-500 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </animated.div>
          );
        })}

        {notifications.length === 0 && (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-emerald-500/30 mx-auto mb-3" />
            <p className="text-sm text-slate-500">All caught up!</p>
          </div>
        )}
      </div>
    </div>
  );
}
