# RIDICULOUS DRAWERS - JavaScript Usage Examples

## Quick Start

The JavaScript automatically initializes when the page loads. No setup required!

```javascript
// Everything works immediately:
// - Click panel handles to toggle
// - Click drawers to expand/collapse
// - Click tabs to switch content
// - Type in console for commands
```

## Programmatic Control

Access all functionality from the browser console or external code:

### Panel Control

```javascript
// Toggle individual panels
Panels.toggle('top')
Panels.toggle('bottom')
Panels.toggle('left')
Panels.toggle('right')

// Open/close all panels
Panels.openAll()      // Opens sequentially with 150ms delay
Panels.closeAll()     // Closes instantly

// Check panel state
State.panels          // { top: false, bottom: true, ... }
```

### Drawer Control

```javascript
// Toggle drawers programmatically
const trigger = document.querySelector('[data-drawer="d1"]')
Drawers.toggle('d1', trigger)

// Open all drawers
Drawers.openAll()     // Cascade with 100ms stagger

// Close all drawers
Drawers.closeAll()

// Get open drawers
State.openDrawers     // Set { 'd1', 'd3', ... }
```

### Collapsible Control

```javascript
// Toggle collapsibles
const header = document.querySelector('[data-collapse="c1"]')
Collapsibles.toggle('c1', header)

// Close all
Collapsibles.closeAll()

// Get open collapsibles
State.openCollapsibles  // Set { 'c1', 'c2a', ... }
```

### Tab Control

```javascript
// Switch tabs programmatically
const tab = document.querySelector('[data-tab="quantum"]')
Tabs.switchLevel1(tab)

// For nested tabs
Tabs.switchLevel2(tab)
Tabs.switchLevel3(tab)
Tabs.switchLevel4(tab)

// Get active tabs
State.activeTabs       // Map { 'l1' => 'quantum', 'l2' => 'alpha', ... }
```

### Console Commands

```javascript
// Run commands programmatically
Console.executeCommand('chaos')
Console.executeCommand('bounce')
Console.executeCommand('rainbow')
Console.executeCommand('reset')

// Add custom logs
Console.log('Custom message here')
```

## Window API

The `RidiculousDrawers` object provides convenient shortcuts:

```javascript
// From browser console
RidiculousDrawers.openAll()      // Open all panels
RidiculousDrawers.closeAll()     // Close all panels
RidiculousDrawers.chaos()        // Chaos mode (open everything)
RidiculousDrawers.bounce()       // Bounce all handles
RidiculousDrawers.rainbow()      // Rainbow color effects
RidiculousDrawers.reset()        // Reset to initial state

// Examples:
RidiculousDrawers.chaos()        // Let the fun begin!
```

## Common Patterns

### Open a Specific Panel Only

```javascript
// Close all, then open one
Panels.closeAll()
Panels.toggle('left')
```

### Create a Panel Sequence

```javascript
// Open panels in custom order
Panels.closeAll()
setTimeout(() => Panels.toggle('top'), 0)
setTimeout(() => Panels.toggle('left'), 200)
setTimeout(() => Panels.toggle('bottom'), 400)
setTimeout(() => Panels.toggle('right'), 600)
```

### Expand All Drawers in a Section

```javascript
// Find all drawers in a parent
const section = document.querySelector('.inception-content')
const triggers = section.querySelectorAll('.drawer-trigger')
triggers.forEach(trigger => {
  if (!trigger.classList.contains('open')) {
    trigger.click()
  }
})
```

### Get Current State

```javascript
// Check what's open
console.log('Open Panels:', Object.entries(State.panels))
console.log('Open Drawers:', Array.from(State.openDrawers))
console.log('Active Tabs:', Object.fromEntries(State.activeTabs))
```

### Listen to State Changes

```javascript
// Since state updates directly, you can observe elements
const observer = new MutationObserver(mutations => {
  console.log('Panel changed!')
})

const panel = document.getElementById('panelTop')
observer.observe(panel, { attributes: true })
```

## Interactive Element Examples

### Toggle a Setting Card

```javascript
// Programmatically toggle settings
const card = document.querySelector('[data-setting="wifi"]')
card.click()  // Toggles on/off

// All settings
document.querySelectorAll('.setting-card').forEach(c => c.click())
```

### Select a Navigation Item

```javascript
// Select nav item
const navItem = document.querySelector('[data-nav="dashboard"]')
navItem.click()  // Shows as active and logs
```

### Select a Tool

```javascript
// Select tool (will animate)
const tool = document.querySelector('[data-tool="pen"]')
tool.click()  // 360° rotation animation

// Select all tools sequentially
document.querySelectorAll('.tool-item').forEach((tool, i) => {
  setTimeout(() => tool.click(), i * 200)
})
```

### Toggle a Switch

```javascript
// Toggle a switch input
const toggle = document.querySelector('.toggle input')
toggle.checked = !toggle.checked
toggle.dispatchEvent(new Event('change'))
```

## Animation Examples

### Bounce Effect

```javascript
// Trigger bounce on demand
Console.activateBounce()

// Or manually
document.querySelectorAll('.panel-handle').forEach((h, i) => {
  setTimeout(() => {
    h.style.animation = 'pulse 0.5s 3'
    setTimeout(() => h.style.animation = '', 1500)
  }, i * 100)
})
```

### Rainbow Effect

```javascript
// Apply rainbow colors
Console.activateRainbow()

// Or manually on specific elements
const colors = ['#00ffff', '#ff00ff', '#39ff14', '#ff6600']
document.querySelectorAll('.drawer-trigger').forEach((el, i) => {
  el.style.borderColor = colors[i % colors.length]
  el.style.boxShadow = `0 0 20px ${colors[i % colors.length]}`
})
```

### Custom Animation

```javascript
// Add custom animation to element
const element = document.querySelector('[data-drawer="d1"]')
element.style.animation = 'spin 2s linear infinite'

// Remove after duration
setTimeout(() => {
  element.style.animation = ''
}, 2000)
```

## Advanced Patterns

### Monitor All Changes

```javascript
// Log all state changes
const originalToggle = Panels.toggle.bind(Panels)
Panels.toggle = function(id) {
  console.log(`Panel toggled: ${id}`, new Date().toLocaleTimeString())
  return originalToggle(id)
}
```

### Create Custom Command

```javascript
// Add custom command to console
const originalExecute = Console.executeCommand.bind(Console)
Console.executeCommand = function(cmd) {
  if (cmd === 'party') {
    Console.log('🎉 PARTY TIME!')
    RidiculousDrawers.rainbow()
    Panels.openAll()
    return
  }
  return originalExecute(cmd)
}
```

### Automate Panel Cycle

```javascript
// Cycle through panels automatically
let current = 0
const panels = ['top', 'bottom', 'left', 'right']

setInterval(() => {
  Panels.closeAll()
  setTimeout(() => {
    Panels.toggle(panels[current])
    current = (current + 1) % panels.length
  }, 100)
}, 2000)
```

### Export State to JSON

```javascript
// Get current state as JSON
const exportState = () => ({
  panels: State.panels,
  drawers: Array.from(State.openDrawers),
  collapsibles: Array.from(State.openCollapsibles),
  tabs: Object.fromEntries(State.activeTabs),
})

const json = JSON.stringify(exportState(), null, 2)
console.log(json)
```

### Restore State from JSON

```javascript
// Restore state from saved JSON
const restoreState = (stateData) => {
  // Restore panels
  Object.entries(stateData.panels).forEach(([id, isOpen]) => {
    const current = State.panels[id]
    if (current !== isOpen) {
      Panels.toggle(id)
    }
  })

  // Restore drawers
  stateData.drawers.forEach(drawerId => {
    const trigger = document.querySelector(`[data-drawer="${drawerId}"]`)
    const panel = document.getElementById(drawerId)
    if (trigger && !panel.classList.contains('open')) {
      Drawers.toggle(drawerId, trigger)
    }
  })
}
```

## Keyboard Programmatic Shortcuts

```javascript
// Simulate keyboard shortcuts
const simulateKeyPress = (key, alt = false) => {
  const event = new KeyboardEvent('keydown', {
    key: key,
    altKey: alt,
    bubbles: true
  })
  document.dispatchEvent(event)
}

// Toggle top panel
simulateKeyPress('ArrowUp', true)

// Close all panels
simulateKeyPress('Escape')
```

## Performance Monitoring

```javascript
// Track animation performance
const startTime = performance.now()
Drawers.openAll()

requestAnimationFrame(() => {
  const endTime = performance.now()
  console.log(`Drawers animation took ${(endTime - startTime).toFixed(2)}ms`)
})
```

## Debugging

```javascript
// Log all interactions
const setupDebug = () => {
  document.addEventListener('click', (e) => {
    if (e.target.closest('.drawer-trigger')) {
      console.log('Drawer clicked:', e.target.dataset.drawer)
    }
    if (e.target.closest('[data-tab]')) {
      console.log('Tab clicked:', e.target.dataset.tab)
    }
  })
}

setupDebug()
```

## Console Tricks

From the browser console, you can:

```javascript
// View all state
State

// Check if panel is open
State.panels.top       // true/false

// List open drawers
[...State.openDrawers]

// Get active tab
State.activeTabs.get('l1')

// Manually trigger all animations
RidiculousDrawers.chaos(); console.log('Chaos activated!')
```

## Integration with Other Scripts

```javascript
// Add event listener for state changes
document.addEventListener('click', (e) => {
  const panel = e.target.closest('.edge-panel')
  if (panel && panel.dataset.state === 'open') {
    console.log('Panel opened:', panel.id)
    // Your custom logic here
  }
})

// Integrate with analytics
const trackPanelOpen = (panelId) => {
  console.log(`Track: Panel ${panelId} opened`)
  // Send to analytics service
}

// Hook into console logging
const originalLog = Console.log.bind(Console)
Console.log = (msg) => {
  console.log(`[RidiculousDrawers] ${msg}`)
  originalLog(msg)
}
```

## Real-World Examples

### Auto-Close Panels After Timeout

```javascript
setTimeout(() => {
  if (Object.values(State.panels).some(p => p)) {
    Console.log('Auto-closing panels...')
    Panels.closeAll()
  }
}, 10000)  // 10 seconds
```

### Require Panel Closure to Continue

```javascript
const ensurePanelsClosed = () => {
  return new Promise(resolve => {
    if (!Object.values(State.panels).some(p => p)) {
      resolve()
    } else {
      Console.log('Please close all panels to continue')
      Panels.closeAll()
      setTimeout(resolve, 600)
    }
  })
}

await ensurePanelsClosed()
```

### Sequential Drawer Opening Demo

```javascript
const openDrawersSequentially = async () => {
  const drawers = document.querySelectorAll('.drawer-trigger')
  for (let drawer of drawers) {
    drawer.click()
    await new Promise(resolve => setTimeout(resolve, 300))
  }
}

openDrawersSequentially()
```

## Testing Examples

```javascript
// Test all panels toggle
['top', 'bottom', 'left', 'right'].forEach(id => {
  Panels.toggle(id)
  console.assert(State.panels[id] === true, `Panel ${id} should be open`)
})

// Test drawer open/close
const trigger = document.querySelector('[data-drawer="d1"]')
Drawers.toggle('d1', trigger)
console.assert(State.openDrawers.has('d1'), 'Drawer d1 should be open')

// Test tab switching
Tabs.switchLevel1(document.querySelector('[data-tab="quantum"]'))
console.assert(State.activeTabs.get('l1') === 'quantum', 'Tab should be quantum')
```
