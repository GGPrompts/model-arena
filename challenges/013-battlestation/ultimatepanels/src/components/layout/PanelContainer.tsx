import { panelRegistry } from '../../config/panels';
import { Panel } from '../ui/Panel';
import { useBattlestationStore } from '../../store/battlestation';

export function PanelContainer() {
  const panelStates = useBattlestationStore((s) => s.panels);
  const closePanel = useBattlestationStore((s) => s.closePanel);
  const bringToFront = useBattlestationStore((s) => s.bringToFront);

  return (
    <div className="fixed inset-0 pointer-events-none z-[500]">
      {/* Panels */}
      {panelRegistry.map((config) => {
        const Content = config.component;
        const state = panelStates[config.id];

        return (
          <Panel
            key={config.id}
            config={config}
            isOpen={state?.isOpen ?? false}
            zIndex={state?.zIndex ?? 100}
            onClose={() => closePanel(config.id)}
            onFocus={() => bringToFront(config.id)}
          >
            <Content />
          </Panel>
        );
      })}
    </div>
  );
}
