import {
  Terminal,
  Activity,
  Music,
  Settings,
  FolderOpen,
  Bell,
  Zap,
  Gauge,
} from 'lucide-react';
import type { PanelConfig } from '../types';
import { TerminalPanel } from '../components/panels/TerminalPanel';
import { SystemStatsPanel } from '../components/panels/SystemStatsPanel';
import { MusicPanel } from '../components/panels/MusicPanel';
import { SettingsPanel } from '../components/panels/SettingsPanel';
import { FileBrowserPanel } from '../components/panels/FileBrowserPanel';
import { NotificationsPanel } from '../components/panels/NotificationsPanel';
import { QuickActionsPanel } from '../components/panels/QuickActionsPanel';
import { MetricsPanel } from '../components/panels/MetricsPanel';

export const panelRegistry: PanelConfig[] = [
  // Left edge
  {
    id: 'terminal',
    position: 'left',
    icon: Terminal,
    title: 'Terminal',
    component: TerminalPanel,
    accentColor: 'emerald',
  },
  {
    id: 'files',
    position: 'left',
    icon: FolderOpen,
    title: 'File Browser',
    component: FileBrowserPanel,
    accentColor: 'amber',
  },

  // Right edge
  {
    id: 'stats',
    position: 'right',
    icon: Activity,
    title: 'System Stats',
    component: SystemStatsPanel,
    accentColor: 'cyan',
  },
  {
    id: 'notifications',
    position: 'right',
    icon: Bell,
    title: 'Notifications',
    component: NotificationsPanel,
    accentColor: 'rose',
  },

  // Bottom edge
  {
    id: 'music',
    position: 'bottom',
    icon: Music,
    title: 'Music Player',
    component: MusicPanel,
    accentColor: 'violet',
  },
  {
    id: 'metrics',
    position: 'bottom',
    icon: Gauge,
    title: 'Metrics',
    component: MetricsPanel,
    accentColor: 'cyan',
  },

  // Top edge
  {
    id: 'settings',
    position: 'top',
    icon: Settings,
    title: 'Settings',
    component: SettingsPanel,
    accentColor: 'violet',
  },
  {
    id: 'quickactions',
    position: 'top',
    icon: Zap,
    title: 'Quick Actions',
    component: QuickActionsPanel,
    accentColor: 'amber',
  },
];

export const getPanelsByPosition = (position: PanelConfig['position']) =>
  panelRegistry.filter((p) => p.position === position);
