import { create } from 'zustand';
import type { PanelState } from '../types';

interface BattlestationState {
  panels: Record<string, PanelState>;
  zIndexCounter: number;

  togglePanel: (panelId: string) => void;
  openPanel: (panelId: string) => void;
  closePanel: (panelId: string) => void;
  closeAllPanels: () => void;
  bringToFront: (panelId: string) => void;
  isPanelOpen: (panelId: string) => boolean;
  getPanelZIndex: (panelId: string) => number;
}

export const useBattlestationStore = create<BattlestationState>((set, get) => ({
  panels: {},
  zIndexCounter: 100,

  togglePanel: (panelId: string) => {
    const panel = get().panels[panelId];
    if (panel?.isOpen) {
      get().closePanel(panelId);
    } else {
      get().openPanel(panelId);
    }
  },

  openPanel: (panelId: string) => {
    set((state) => ({
      zIndexCounter: state.zIndexCounter + 1,
      panels: {
        ...state.panels,
        [panelId]: {
          isOpen: true,
          zIndex: state.zIndexCounter + 1,
          openedAt: Date.now(),
        },
      },
    }));
  },

  closePanel: (panelId: string) => {
    set((state) => ({
      panels: {
        ...state.panels,
        [panelId]: {
          ...state.panels[panelId],
          isOpen: false,
        },
      },
    }));
  },

  closeAllPanels: () => {
    set((state) => {
      const newPanels: Record<string, PanelState> = {};
      Object.entries(state.panels).forEach(([id, panel]) => {
        newPanels[id] = { ...panel, isOpen: false };
      });
      return { panels: newPanels };
    });
  },

  bringToFront: (panelId: string) => {
    const panel = get().panels[panelId];
    if (panel?.isOpen) {
      set((state) => ({
        zIndexCounter: state.zIndexCounter + 1,
        panels: {
          ...state.panels,
          [panelId]: {
            ...state.panels[panelId],
            zIndex: state.zIndexCounter + 1,
          },
        },
      }));
    }
  },

  isPanelOpen: (panelId: string) => {
    return get().panels[panelId]?.isOpen ?? false;
  },

  getPanelZIndex: (panelId: string) => {
    return get().panels[panelId]?.zIndex ?? 100;
  },
}));
