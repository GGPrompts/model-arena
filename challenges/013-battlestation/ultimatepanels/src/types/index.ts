import type { ComponentType, ReactNode } from 'react';

export type PanelPosition = 'top' | 'right' | 'bottom' | 'left';

export interface PanelConfig {
  id: string;
  position: PanelPosition;
  icon: ComponentType<{ className?: string }>;
  title: string;
  component: ComponentType;
  accentColor?: 'cyan' | 'violet' | 'emerald' | 'amber' | 'rose';
}

export interface PanelState {
  isOpen: boolean;
  zIndex: number;
  openedAt: number;
}

export interface TabButtonProps {
  config: PanelConfig;
  isActive: boolean;
  onClick: () => void;
}

export interface PanelProps {
  config: PanelConfig;
  isOpen: boolean;
  zIndex: number;
  onClose: () => void;
  onFocus: () => void;
  children: ReactNode;
}
