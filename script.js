const screens = {
  dashboard: {
    title: 'Operations dashboard',
    description: 'An operations dashboard bringing project counts, compliance indicators, and program status across Laguna LGUs into a single shared view.'
  },
  intake: {
    title: 'Documentary intake & review',
    description: 'The documentary intake queue connects uploaded files, requirement slots, and review checklists for a traceable approval workflow.'
  },
  deadlines: {
    title: 'Compliance deadline tracker',
    description: 'The compliance deadline tracker organizes upcoming deadlines, grace periods, and escalation notices on a 15-day review cadence.'
  },
  handoff: {
    title: 'Regional handoff',
    description: 'The regional handoff workspace organizes reviewed documentary packages for structured transfer to DILG Regional Office Google Drive folders.'
  },
  assistant: {
    title: 'Workspace assistant',
    description: 'The smart assistant assists authorized personnel with requirement lookups, policy inquiries, and contextual operational guidance.'
  }
};

const tabs = [...document.querySelectorAll('[role="tab"]')];
const screen = document.querySelector('#system-screen');
const panel = document.querySelector('#screen-panel');
const dialog = document.querySelector('#image-dialog');
let selected = 'dashboard';
let lastFocused;

function selectTab(tab) {
  selected = tab.dataset.screen;
  tabs.forEach(t => {
    const active = t === tab;
    t.setAttribute('aria-selected', String(active));
    t.tabIndex = active ? 0 : -1;
  });
  if (screen) {
    screen.src = `assets/${selected}.webp`;
    screen.alt = `${screens[selected].title} — DILG-PDMU Workspace sample data interface.`;
  }
  const titleEl = document.querySelector('#screen-title');
  const descEl = document.querySelector('#screen-description');
  if (titleEl) titleEl.textContent = screens[selected].title;
  if (descEl) descEl.textContent = screens[selected].description;
  const zoomBtn = document.querySelector('.screen-zoom');
  if (zoomBtn) zoomBtn.setAttribute('aria-label', `Enlarge ${screens[selected].title} screenshot`);
  if (panel) panel.setAttribute('aria-labelledby', tab.id);
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectTab(tab));
  tab.addEventListener('keydown', e => {
    let next;
    if (e.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (e.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = tabs.length - 1;
    if (next !== undefined) {
      e.preventDefault();
      selectTab(tabs[next]);
      tabs[next].focus();
    }
  });
});

const zoomBtn = document.querySelector('.screen-zoom');
if (zoomBtn && dialog) {
  zoomBtn.addEventListener('click', () => {
    lastFocused = document.activeElement;
    const img = dialog.querySelector('img');
    const p = dialog.querySelector('p');
    if (img && screen) {
      img.src = screen.src;
      img.alt = screen.alt;
    }
    if (p) p.textContent = screens[selected].description;
    dialog.showModal();
  });
}

const closeBtn = document.querySelector('.dialog-close');
if (closeBtn && dialog) {
  closeBtn.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => {
    if (e.target === dialog) {
      const r = dialog.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) {
        dialog.close();
      }
    }
  });
  dialog.addEventListener('close', () => lastFocused?.focus());
}

const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('nav');
if (menu && nav) {
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('open', open);
  });

  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menu.setAttribute('aria-expanded', 'false');
      nav.classList.remove('open');
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      menu.setAttribute('aria-expanded', 'false');
      nav.classList.remove('open');
    }
  });
}
