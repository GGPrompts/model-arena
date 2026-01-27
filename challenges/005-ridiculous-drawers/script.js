// RIDICULOUS DRAWERS - Complete JavaScript Engine
// Agent 3: Interaction & Animation Master

// Configuration
const CONFIG = {
  animationDuration: 350,
  bounceEasing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  elasticEasing: 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
};

// State Management
const State = {
  panels: { top: false, bottom: false, left: false, right: false },
  openDrawers: new Set(),
  openCollapsibles: new Set(),
  activeTabs: new Map(),
  selectedTools: new Map(),
};

// ============================================
// PANEL MANAGEMENT
// ============================================

const Panels = {
  elements: {},

  init() {
    this.elements = {
      top: document.getElementById('panelTop'),
      bottom: document.getElementById('panelBottom'),
      left: document.getElementById('panelLeft'),
      right: document.getElementById('panelRight'),
    };
    this.setupHandlers();
    this.setupKeyboardShortcuts();
  },

  setupHandlers() {
    document.querySelectorAll('.panel-handle').forEach(handle => {
      handle.addEventListener('click', (e) => {
        e.stopPropagation();
        const panelId = handle.dataset.handle;
        this.toggle(panelId);
      });

      // Add rotation animation on hover
      handle.addEventListener('mouseenter', () => {
        handle.style.transform = 'rotate(10deg) scale(1.1)';
      });

      handle.addEventListener('mouseleave', () => {
        handle.style.transform = '';
      });
    });
  },

  toggle(panelId) {
    const panel = this.elements[panelId];
    if (!panel) return;

    const isOpen = State.panels[panelId];
    State.panels[panelId] = !isOpen;

    panel.dataset.state = !isOpen ? 'open' : 'closed';
    this.updateDim();
    this.log(`Panel ${panelId}: ${!isOpen ? 'OPEN' : 'CLOSED'}`);
  },

  openAll() {
    let delay = 0;
    Object.keys(this.elements).forEach(id => {
      setTimeout(() => {
        State.panels[id] = true;
        this.elements[id].dataset.state = 'open';
        this.updateDim();
        this.animateHandle(this.elements[id]);
      }, delay);
      delay += 150;
    });
  },

  closeAll() {
    Object.keys(this.elements).forEach(id => {
      State.panels[id] = false;
      this.elements[id].dataset.state = 'closed';
    });
    this.updateDim();
  },

  updateDim() {
    const mainContent = document.getElementById('mainContent');
    const anyOpen = Object.values(State.panels).some(v => v);
    mainContent.classList.toggle('dimmed', anyOpen);
  },

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAll();
        return;
      }

      if (e.altKey) {
        const keyMap = {
          'ArrowUp': 'top',
          'ArrowDown': 'bottom',
          'ArrowLeft': 'left',
          'ArrowRight': 'right',
        };

        const panelId = keyMap[e.key];
        if (panelId) {
          e.preventDefault();
          this.toggle(panelId);
        }
      }
    });
  },

  animateHandle(panel) {
    const handle = panel.querySelector('.panel-handle');
    if (handle) {
      handle.style.animation = 'pulse 0.6s ease-in-out';
      setTimeout(() => {
        handle.style.animation = '';
      }, 600);
    }
  },

  log(msg) {
    Console.log(msg);
  },
};

// ============================================
// CONSOLE SYSTEM
// ============================================

const Console = {
  output: null,
  input: null,

  init() {
    this.output = document.getElementById('consoleOutput');
    this.input = document.getElementById('consoleInput');
    this.setupInput();
    this.log('Ridiculous Drawers initialized!');
    this.log('Keyboard: Alt+Arrows, ESC to close all');
    this.log('Commands: help, clear, chaos, bounce, rainbow');
  },

  setupInput() {
    this.input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && e.target.value.trim()) {
        const cmd = e.target.value.trim().toLowerCase();
        this.log(cmd);
        this.executeCommand(cmd);
        e.target.value = '';
      }
    });
  },

  log(msg) {
    const line = document.createElement('div');
    line.className = 'console-line';
    line.textContent = msg;
    this.output.appendChild(line);
    this.output.scrollTop = this.output.scrollHeight;
  },

  executeCommand(cmd) {
    const [action, ...args] = cmd.split(' ');

    switch (action) {
      case 'help':
        this.log('Commands: help | clear | chaos | bounce | rainbow | reset');
        break;

      case 'clear':
        this.output.innerHTML = '';
        break;

      case 'chaos':
        this.log('CHAOS UNLEASHED!');
        Panels.openAll();
        Drawers.openAll();
        break;

      case 'bounce':
        this.log('Bounce mode activated!');
        this.activateBounce();
        break;

      case 'rainbow':
        this.log('Rainbow mode activated!');
        this.activateRainbow();
        break;

      case 'reset':
        this.log('Resetting all states...');
        Panels.closeAll();
        Drawers.closeAll();
        Collapsibles.closeAll();
        Tabs.resetAll();
        break;

      default:
        this.log(`Unknown command: ${action}`);
    }
  },

  activateBounce() {
    document.querySelectorAll('.panel-handle').forEach((handle, i) => {
      setTimeout(() => {
        handle.style.animation = 'pulse 0.5s ease-in-out 3';
        setTimeout(() => {
          handle.style.animation = '';
        }, 1500);
      }, i * 100);
    });
  },

  activateRainbow() {
    const colors = ['#00ffff', '#ff00ff', '#39ff14', '#ff6600', '#ff1493', '#00bfff'];
    document.querySelectorAll('.drawer-trigger').forEach((trigger, i) => {
      const color = colors[i % colors.length];
      trigger.style.borderColor = color;
      trigger.style.boxShadow = `0 0 20px ${color}`;
      setTimeout(() => {
        trigger.style.borderColor = '';
        trigger.style.boxShadow = '';
      }, 5000);
    });
    this.log('Rainbow effect applied for 5 seconds!');
  },
};

// ============================================
// DRAWER MANAGEMENT
// ============================================

const Drawers = {
  init() {
    this.setupTriggers();
  },

  setupTriggers() {
    document.querySelectorAll('.drawer-trigger').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const drawerId = trigger.dataset.drawer;
        this.toggle(drawerId, trigger);
      });

      // Fun hover effect: slight rotation
      trigger.addEventListener('mouseenter', () => {
        trigger.style.transform = 'translateX(5px) rotate(2deg)';
      });

      trigger.addEventListener('mouseleave', () => {
        trigger.style.transform = '';
      });
    });
  },

  toggle(drawerId, trigger) {
    const drawer = document.getElementById(drawerId);
    if (!drawer) return;

    const isOpen = drawer.classList.contains('open');
    const targetState = !isOpen;

    if (targetState) {
      drawer.classList.add('open');
      trigger.classList.add('open');
      State.openDrawers.add(drawerId);
      Console.log(`Drawer ${drawerId}: OPENED`);

      // Add rotation effect on open
      trigger.style.animation = 'none';
      setTimeout(() => {
        trigger.style.animation = '';
      }, 10);
    } else {
      drawer.classList.remove('open');
      trigger.classList.remove('open');
      State.openDrawers.delete(drawerId);
      Console.log(`Drawer ${drawerId}: CLOSED`);
    }
  },

  openAll() {
    let delay = 0;
    document.querySelectorAll('.drawer-trigger').forEach(trigger => {
      setTimeout(() => {
        if (!trigger.classList.contains('open')) {
          trigger.click();
        }
      }, delay);
      delay += 100;
    });
  },

  closeAll() {
    document.querySelectorAll('.drawer-trigger.open').forEach(trigger => {
      trigger.click();
    });
  },
};

// ============================================
// COLLAPSIBLE MANAGEMENT
// ============================================

const Collapsibles = {
  init() {
    this.setupHeaders();
  },

  setupHeaders() {
    document.querySelectorAll('.collapse-header').forEach(header => {
      header.addEventListener('click', () => {
        const collapseId = header.dataset.collapse;
        this.toggle(collapseId, header);
      });

      // Add scale effect on hover
      header.addEventListener('mouseenter', () => {
        header.style.transform = 'scale(1.02)';
      });

      header.addEventListener('mouseleave', () => {
        header.style.transform = '';
      });
    });
  },

  toggle(collapseId, header) {
    const body = document.getElementById(collapseId);
    if (!body) return;

    const isOpen = body.classList.contains('open');
    const targetState = !isOpen;

    if (targetState) {
      body.classList.add('open');
      header.classList.add('open');
      State.openCollapsibles.add(collapseId);
      Console.log(`Collapse ${collapseId}: OPENED`);
    } else {
      body.classList.remove('open');
      header.classList.remove('open');
      State.openCollapsibles.delete(collapseId);
      Console.log(`Collapse ${collapseId}: CLOSED`);
    }
  },

  closeAll() {
    document.querySelectorAll('.collapse-header.open').forEach(header => {
      header.click();
    });
  },
};

// ============================================
// TABBED INTERFACE MANAGEMENT
// ============================================

const Tabs = {
  init() {
    this.setupLevel1();
    this.setupLevel2();
    this.setupLevel3();
    this.setupLevel4();
  },

  setupLevel1() {
    document.querySelectorAll('.tab-l1').forEach(tab => {
      tab.addEventListener('click', () => this.switchLevel1(tab));

      // Add hover effect
      tab.addEventListener('mouseenter', () => {
        if (!tab.classList.contains('active')) {
          tab.style.transform = 'translateY(-2px)';
        }
      });

      tab.addEventListener('mouseleave', () => {
        if (!tab.classList.contains('active')) {
          tab.style.transform = '';
        }
      });
    });
  },

  setupLevel2() {
    document.querySelectorAll('.tab-l2').forEach(tab => {
      tab.addEventListener('click', () => this.switchLevel2(tab));

      tab.addEventListener('mouseenter', () => {
        if (!tab.classList.contains('active')) {
          tab.style.transform = 'translateX(4px)';
        }
      });

      tab.addEventListener('mouseleave', () => {
        if (!tab.classList.contains('active')) {
          tab.style.transform = '';
        }
      });
    });
  },

  setupLevel3() {
    document.querySelectorAll('.tab-l3').forEach(tab => {
      tab.addEventListener('click', () => this.switchLevel3(tab));

      tab.addEventListener('mouseenter', () => {
        if (!tab.classList.contains('active')) {
          tab.style.transform = 'scale(1.03)';
        }
      });

      tab.addEventListener('mouseleave', () => {
        if (!tab.classList.contains('active')) {
          tab.style.transform = '';
        }
      });
    });
  },

  setupLevel4() {
    document.querySelectorAll('.tab-l4').forEach(tab => {
      tab.addEventListener('click', () => this.switchLevel4(tab));

      tab.addEventListener('mouseenter', () => {
        if (!tab.classList.contains('active')) {
          tab.style.opacity = '0.7';
        }
      });

      tab.addEventListener('mouseleave', () => {
        if (!tab.classList.contains('active')) {
          tab.style.opacity = '';
        }
      });
    });
  },

  switchLevel1(tab) {
    const tabId = tab.dataset.tab;

    // Deactivate all tabs
    document.querySelectorAll('.tab-l1').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-l1-panel').forEach(p => p.classList.remove('active'));

    // Activate selected tab
    tab.classList.add('active');
    const panel = document.getElementById(tabId);
    if (panel) {
      panel.classList.add('active');
      State.activeTabs.set('l1', tabId);
      Console.log(`Tab L1: ${tabId}`);
    }
  },

  switchLevel2(tab) {
    const container = tab.closest('.tabs-l2');
    const tabId = tab.dataset.tab;

    if (!container) return;

    // Deactivate all tabs in this container
    container.querySelectorAll('.tab-l2').forEach(t => t.classList.remove('active'));
    container.querySelectorAll('.tab-l2-panel').forEach(p => p.classList.remove('active'));

    // Activate selected tab
    tab.classList.add('active');
    const panel = container.querySelector('#' + tabId);
    if (panel) {
      panel.classList.add('active');
      State.activeTabs.set('l2', tabId);
      Console.log(`Tab L2: ${tabId}`);
    }
  },

  switchLevel3(tab) {
    const container = tab.closest('.tabs-l3');
    const tabId = tab.dataset.tab;

    if (!container) return;

    // Deactivate all tabs in this container
    container.querySelectorAll('.tab-l3').forEach(t => t.classList.remove('active'));
    container.querySelectorAll('.tab-l3-panel').forEach(p => p.classList.remove('active'));

    // Activate selected tab
    tab.classList.add('active');
    const panel = container.querySelector('#' + tabId);
    if (panel) {
      panel.classList.add('active');
      State.activeTabs.set('l3', tabId);
      Console.log(`Tab L3: ${tabId}`);
    }
  },

  switchLevel4(tab) {
    const container = tab.closest('.tabs-l4');
    const tabId = tab.dataset.tab;

    if (!container) return;

    // Deactivate all tabs in this container
    container.querySelectorAll('.tab-l4').forEach(t => t.classList.remove('active'));
    container.querySelectorAll('.tab-l4-panel').forEach(p => p.classList.remove('active'));

    // Activate selected tab
    tab.classList.add('active');
    const panel = container.querySelector('#' + tabId);
    if (panel) {
      panel.classList.add('active');
      State.activeTabs.set('l4', tabId);
      Console.log(`Tab L4: ${tabId}`);
    }
  },

  resetAll() {
    State.activeTabs.clear();
    document.querySelectorAll('.tab-l1-panel, .tab-l2-panel, .tab-l3-panel, .tab-l4-panel').forEach(p => {
      p.classList.remove('active');
    });

    // Reset to first active tab of each level
    document.querySelectorAll('.tab-l1.active, .tab-l2.active, .tab-l3.active, .tab-l4.active').forEach(tab => {
      tab.click();
    });
  },
};

// ============================================
// INTERACTIVE ELEMENTS
// ============================================

const InteractiveElements = {
  init() {
    this.setupSettings();
    this.setupNav();
    this.setupTools();
    this.setupToggles();
  },

  setupSettings() {
    document.querySelectorAll('.setting-card').forEach(card => {
      card.addEventListener('click', () => {
        card.classList.toggle('active');
        const setting = card.dataset.setting;
        const state = card.classList.contains('active') ? 'ON' : 'OFF';
        Console.log(`${setting}: ${state}`);

        // Add scale animation
        card.style.transform = 'scale(1.1)';
        setTimeout(() => {
          card.style.transform = '';
        }, 150);
      });

      card.addEventListener('mouseenter', () => {
        if (!card.classList.contains('active')) {
          card.style.transform = 'translateY(-4px) rotate(2deg)';
        }
      });

      card.addEventListener('mouseleave', () => {
        if (!card.classList.contains('active')) {
          card.style.transform = '';
        }
      });
    });
  },

  setupNav() {
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        Console.log(`Nav: ${item.dataset.nav}`);

        // Add rotation effect
        item.style.transform = 'rotateY(10deg)';
        setTimeout(() => {
          item.style.transform = '';
        }, 300);
      });

      item.addEventListener('mouseenter', () => {
        if (!item.classList.contains('active')) {
          item.style.transform = 'translateX(8px)';
        }
      });

      item.addEventListener('mouseleave', () => {
        if (!item.classList.contains('active')) {
          item.style.transform = '';
        }
      });
    });
  },

  setupTools() {
    document.querySelectorAll('.tool-item').forEach(item => {
      item.addEventListener('click', () => {
        document.querySelectorAll('.tool-item').forEach(i => i.classList.remove('selected'));
        item.classList.add('selected');
        Console.log(`Tool: ${item.dataset.tool}`);

        // Add rotation effect on selection
        item.style.transform = 'rotate(360deg) scale(1.2)';
        item.style.transition = 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        setTimeout(() => {
          item.style.transform = '';
          item.style.transition = '';
        }, 600);
      });

      item.addEventListener('mouseenter', () => {
        if (!item.classList.contains('selected')) {
          item.style.transform = 'scale(1.15) rotate(15deg)';
        }
      });

      item.addEventListener('mouseleave', () => {
        if (!item.classList.contains('selected')) {
          item.style.transform = '';
        }
      });
    });
  },

  setupToggles() {
    document.querySelectorAll('.toggle input').forEach(toggle => {
      toggle.addEventListener('change', (e) => {
        const row = e.target.closest('.toggle-row');
        const label = row.querySelector('span:not(.toggle-slider)');
        const state = e.target.checked ? 'ON' : 'OFF';
        if (label) {
          Console.log(`${label.textContent}: ${state}`);
        }

        // Animate the toggle
        const slider = e.target.nextElementSibling;
        slider.style.transform = 'scale(1.05)';
        setTimeout(() => {
          slider.style.transform = '';
        }, 100);
      });
    });
  },
};

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  Panels.init();
  Console.init();
  Drawers.init();
  Collapsibles.init();
  Tabs.init();
  InteractiveElements.init();

  // Add some fun: Easter egg animations
  setupEasterEggs();
});

function setupEasterEggs() {
  // Konami code for extra chaos
  const konamiCode = [];
  const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

  document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    if (konamiCode.length > konamiSequence.length) {
      konamiCode.shift();
    }

    if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
      triggerUltimateChaos();
      konamiCode.length = 0;
    }
  });

  // Random easter egg triggers
  document.querySelectorAll('[data-easter-egg]').forEach(element => {
    element.addEventListener('click', (e) => {
      if (element.dataset.easterEgg === 'spin') {
        e.target.style.animation = 'spin 2s linear infinite';
      }
    });
  });
}

function triggerUltimateChaos() {
  Console.log('ULTIMATE CHAOS MODE ACTIVATED!!!');
  Console.log('Reality is melting... Prepare yourself...');

  // Open everything
  Panels.openAll();
  Drawers.openAll();

  // Apply chaos rotation to all major elements
  document.querySelectorAll('.inception-zone, .tab-zone').forEach((element, i) => {
    setTimeout(() => {
      element.style.animation = 'spin 3s linear infinite';
      setTimeout(() => {
        element.style.animation = '';
      }, 3000);
    }, i * 200);
  });

  // Pulse all the colors
  const colors = ['#00ffff', '#ff00ff', '#39ff14', '#ff6600', '#ff1493', '#00bfff', '#bf00ff', '#ffff00'];
  document.querySelectorAll('.drawer-trigger, .collapse-header, .tab-l1, .tab-l2, .tab-l3, .tab-l4').forEach((elem, i) => {
    const color = colors[i % colors.length];
    elem.style.borderColor = color;
    elem.style.boxShadow = `0 0 20px ${color}, inset 0 0 20px ${color}`;

    setTimeout(() => {
      elem.style.borderColor = '';
      elem.style.boxShadow = '';
    }, 5000);
  });
}

// Expose some functions to window for console access
window.RidiculousDrawers = {
  openAll: () => Panels.openAll(),
  closeAll: () => Panels.closeAll(),
  chaos: () => Console.executeCommand('chaos'),
  bounce: () => Console.executeCommand('bounce'),
  rainbow: () => Console.executeCommand('rainbow'),
  reset: () => Console.executeCommand('reset'),
};
