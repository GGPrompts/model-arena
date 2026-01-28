import { animated, useSpring } from '@react-spring/web';
import type { PanelPosition } from '../../types';
import { getPanelsByPosition } from '../../config/panels';
import { TabButton } from '../ui/TabButton';
import { useBattlestationStore } from '../../store/battlestation';
import clsx from 'clsx';

interface TabRailProps {
  position: PanelPosition;
  visible: boolean;
}

// Hidden position transforms
const hiddenTransforms = {
  top: 'translateX(-50%) translateY(-100%)',
  right: 'translateY(-50%) translateX(100%)',
  bottom: 'translateX(-50%) translateY(100%)',
  left: 'translateY(-50%) translateX(-100%)',
};

const visibleTransforms = {
  top: 'translateX(-50%) translateY(0%)',
  right: 'translateY(-50%) translateX(0%)',
  bottom: 'translateX(-50%) translateY(0%)',
  left: 'translateY(-50%) translateX(0%)',
};

export function TabRail({ position, visible }: TabRailProps) {
  const panels = getPanelsByPosition(position);
  const togglePanel = useBattlestationStore((s) => s.togglePanel);
  const panelStates = useBattlestationStore((s) => s.panels);

  const spring = useSpring({
    transform: visible ? visibleTransforms[position] : hiddenTransforms[position],
    opacity: visible ? 1 : 0,
    config: { tension: 400, friction: 28 },
  });

  if (panels.length === 0) return null;

  const isVertical = position === 'left' || position === 'right';

  return (
    <animated.nav
      style={spring}
      className={clsx(
        'fixed z-[1000] flex gap-1.5 p-2 backdrop-blur-md',
        'bs-rail',
        isVertical ? 'flex-col' : 'flex-row',
        // Base position without transforms (transforms handled by spring)
        position === 'top' && 'top-0 left-1/2',
        position === 'right' && 'right-0 top-1/2',
        position === 'bottom' && 'bottom-0 left-1/2',
        position === 'left' && 'left-0 top-1/2'
      )}
      data-position={position}
    >
      {panels.map((panel) => (
        <TabButton
          key={panel.id}
          config={panel}
          isActive={panelStates[panel.id]?.isOpen ?? false}
          onClick={() => togglePanel(panel.id)}
        />
      ))}
    </animated.nav>
  );
}
