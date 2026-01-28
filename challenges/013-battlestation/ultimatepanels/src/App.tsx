import { useEffect, useState, useCallback } from 'react';
import { TabRail } from './components/layout/TabRail';
import { PanelContainer } from './components/layout/PanelContainer';
import { Background } from './components/layout/Background';
import { CenterTerminal } from './components/layout/CenterTerminal';
import { useBattlestationStore } from './store/battlestation';
import { panelRegistry } from './config/panels';
import './index.css';

function App() {
  const closeAllPanels = useBattlestationStore((s) => s.closeAllPanels);
  const openPanel = useBattlestationStore((s) => s.openPanel);
  const closePanel = useBattlestationStore((s) => s.closePanel);
  const panelStates = useBattlestationStore((s) => s.panels);
  const [altHeld, setAltHeld] = useState(false);

  // Cycle through panels at a given position
  const cyclePanel = useCallback((position: 'left' | 'right' | 'top' | 'bottom') => {
    const panelsAtPosition = panelRegistry.filter((p) => p.position === position);
    if (panelsAtPosition.length === 0) return;

    // Find which panel (if any) is currently open at this position
    const openIndex = panelsAtPosition.findIndex((p) => panelStates[p.id]?.isOpen);

    if (openIndex === -1) {
      // None open - open the first one
      openPanel(panelsAtPosition[0].id);
    } else {
      // Close current
      closePanel(panelsAtPosition[openIndex].id);
      // Open next (cycle) - if it was the last one, don't open any (close all at this position)
      const nextIndex = (openIndex + 1) % (panelsAtPosition.length + 1);
      if (nextIndex < panelsAtPosition.length) {
        openPanel(panelsAtPosition[nextIndex].id);
      }
    }
  }, [panelStates, openPanel, closePanel]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Track Alt key
      if (e.key === 'Alt') {
        setAltHeld(true);
      }

      // Escape to close all
      if (e.key === 'Escape') {
        closeAllPanels();
      }

      // Alt + Arrow to cycle panels
      if (e.altKey) {
        const direction = {
          ArrowLeft: 'left',
          ArrowRight: 'right',
          ArrowUp: 'top',
          ArrowDown: 'bottom',
        }[e.key] as 'left' | 'right' | 'top' | 'bottom' | undefined;

        if (direction) {
          e.preventDefault();
          cyclePanel(direction);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Alt') {
        setAltHeld(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [closeAllPanels, cyclePanel]);

  return (
    <div className="bs-root h-screen w-screen overflow-hidden">
      {/* Animated background */}
      <Background />

      {/* Tab rails on all edges - only visible when Alt is held */}
      <TabRail position="top" visible={altHeld} />
      <TabRail position="right" visible={altHeld} />
      <TabRail position="bottom" visible={altHeld} />
      <TabRail position="left" visible={altHeld} />

      {/* Sliding panels */}
      <PanelContainer />

      {/* Persistent center terminal - always visible */}
      <CenterTerminal />
    </div>
  );
}

export default App;
