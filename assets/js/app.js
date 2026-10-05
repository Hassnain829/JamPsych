/* =========================================================
   JamPsych LMS — shared UI behaviour
   Sidebar, top-bar dropdowns, toasts, helpers
   ========================================================= */

/* ---------- helpers ---------- */
const JP = {
  /** Build initials from a full name: "Kerri-Ann Peart" -> "KP" */
  initials(name) {
    return String(name || '')
      .trim()
      .split(/[\s-]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(w => w[0].toUpperCase())
      .join('');
  },

  /** Deterministic pastel avatar colour from a name */
  avatarColor(name) {
    const palette = [
      ['#e7f5ee', '#1c9a5b'], ['#e6eefe', '#3b82f6'], ['#fdf1de', '#c98a3e'],
      ['#f3e8fd', '#8b5cf6'], ['#fdeceb', '#e0483f'], ['#e2f6f7', '#0e9aa7']
    ];
    let hash = 0;
    for (let i = 0; i < String(name).length; i++) hash = (hash * 31 + name.charCodeAt(i)) % 9973;
    return palette[hash % palette.length];
  },

  /** <div class="avatar-sm"> markup with initials + colour */
  avatar(name, cls = 'avatar-sm') {
    const [bg, fg] = JP.avatarColor(name);
    return `<div class="${cls}" style="background:${bg};color:${fg}">${JP.initials(name)}</div>`;
  },

  escape(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  },

  /** Toast notification */
  toast(message, type = 'success') {
    let el = document.getElementById('jpToast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'jpToast';
      el.className = 'toast';
      document.body.appendChild(el);
    }
    el.className = 'toast' + (type === 'error' ? ' error' : '');
    el.innerHTML = `<i class="fa-solid ${type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-check'}"></i><span>${JP.escape(message)}</span>`;
    requestAnimationFrame(() => el.classList.add('show'));
    clearTimeout(JP._toastTimer);
    JP._toastTimer = setTimeout(() => el.classList.remove('show'), 3200);
  },

  /** Coming-soon popup for pages that are not built yet */
  comingSoon(name = '', type = 'page') {
    let modal = document.getElementById('jpComingSoonModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'jpComingSoonModal';
      modal.className = 'modal-overlay';
      modal.innerHTML = `
        <div class="modal-box modal-box-sm modal-coming-soon" role="dialog" aria-modal="true" aria-labelledby="jpComingSoonTitle">
          <button type="button" class="modal-close" data-modal-close aria-label="Close"><i class="fa-solid fa-xmark"></i></button>
          <div class="coming-soon-head">
            <h2 id="jpComingSoonTitle">Coming Soon</h2>
            <p id="jpComingSoonSubtitle"></p>
          </div>
          <div class="modal-body coming-soon-body">
            <div class="coming-soon-icon"><i class="fa-solid fa-screwdriver-wrench"></i></div>
            <p id="jpComingSoonMessage"></p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-modal-close>Got it</button>
          </div>
        </div>`;
      document.body.appendChild(modal);

      modal.addEventListener('mousedown', e => {
        if (e.target === modal) modal.classList.remove('open');
      });
      modal.querySelectorAll('[data-modal-close]').forEach(btn => {
        btn.addEventListener('click', () => modal.classList.remove('open'));
      });
    }

    const label = String(name || '').trim();
    const subtitle = modal.querySelector('#jpComingSoonSubtitle');
    const message = modal.querySelector('#jpComingSoonMessage');

    if (type === 'section') {
      const section = label || 'This section';
      subtitle.textContent = section;
      subtitle.style.display = '';
      message.textContent = `${section} is currently under development and will be available soon.`;
    } else {
      const page = label || 'This page';
      subtitle.textContent = page;
      subtitle.style.display = '';
      message.textContent = `The ${page} page is currently under development and will be available soon.`;
    }

    modal.classList.add('open');
  },

  /** Download any text payload as a file */
  download(filename, content, mime = 'text/plain;charset=utf-8') {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  },

  /** Rows (array of arrays) -> CSV file download */
  exportCsv(filename, headers, rows) {
    const esc = v => `"${String(v == null ? '' : v).replace(/"/g, '""')}"`;
    const csv = [headers.map(esc).join(','), ...rows.map(r => r.map(esc).join(','))].join('\r\n');
    JP.download(filename, csv, 'text/csv;charset=utf-8');
  },

  /** Render pagination buttons into a container */
  renderPagination(container, currentPage, totalPages, onChange) {
    if (!container) return;
    container.innerHTML = '';
    const mk = (label, page, opts = {}) => {
      const b = document.createElement('button');
      b.innerHTML = label;
      if (opts.active) b.classList.add('active');
      if (opts.disabled) b.disabled = true;
      if (!opts.disabled) b.addEventListener('click', () => onChange(page));
      container.appendChild(b);
    };
    const gap = () => {
      const s = document.createElement('span');
      s.className = 'ellipsis';
      s.textContent = '...';
      container.appendChild(s);
    };

    mk('<i class="fa-solid fa-chevron-left"></i>', currentPage - 1, { disabled: currentPage === 1 });

    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1, 2, 3);
      if (currentPage > 3 && currentPage < totalPages) pages.push(currentPage);
      pages.push(totalPages);
    }
    const unique = [...new Set(pages)].filter(p => p >= 1 && p <= totalPages).sort((a, b) => a - b);
    let prev = 0;
    unique.forEach(p => {
      if (p - prev > 1) gap();
      mk(String(p), p, { active: p === currentPage });
      prev = p;
    });

    mk('<i class="fa-solid fa-chevron-right"></i>', currentPage + 1, { disabled: currentPage === totalPages || totalPages === 0 });
  }
};

/* ---------- shared boot ---------- */
document.addEventListener('DOMContentLoaded', () => {
  /* Sidebar (mobile) */
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebarBackdrop');
  const toggle = document.getElementById('menuToggle');

  const closeSidebar = () => {
    sidebar && sidebar.classList.remove('open');
    backdrop && backdrop.classList.remove('open');
  };
  toggle && toggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    backdrop.classList.toggle('open');
  });
  backdrop && backdrop.addEventListener('click', closeSidebar);

  /* Top-bar dropdowns (notifications / messages / profile) */
  document.querySelectorAll('[data-dropdown]').forEach(trigger => {
    const panel = document.getElementById(trigger.dataset.dropdown);
    if (!panel) return;
    trigger.addEventListener('click', e => {
      e.stopPropagation();
      const wasOpen = panel.classList.contains('open');
      document.querySelectorAll('.dropdown-panel.open, .action-dropdown.open')
        .forEach(p => p.classList.remove('open'));
      if (!wasOpen) panel.classList.add('open');
    });
    panel.addEventListener('click', e => e.stopPropagation());
  });

  /* Profile dropdown — switch between the Admin, Uploader and Student
     dashboards (demo). Which role is "current" comes from data-role on
     the .profile-trigger button; every other role gets a switch link. */
  const ROLE_INFO = {
    admin:    { label: 'Admin',    sub: 'Preview admin workspace',    icon: 'fa-user-shield',   href: 'index.html' },
    uploader: { label: 'Uploader', sub: 'Preview uploader workspace', icon: 'fa-user-tie',       href: 'uploader-dashboard.html' },
    student:  { label: 'Student',  sub: 'Preview student workspace',  icon: 'fa-user-graduate',  href: 'student-dashboard.html' }
  };

  const profilePanel = document.getElementById('profilePanel');
  const profileTrigger = document.querySelector('.profile-trigger');
  if (profilePanel && profileTrigger && !profilePanel.querySelector('[data-dashboard-switch]')) {
    const currentRole = profileTrigger.dataset.role || 'admin';
    const otherRoles = Object.keys(ROLE_INFO).filter(r => r !== currentRole && ROLE_INFO[r]);

    if (otherRoles.length) {
      const divider = document.createElement('div');
      divider.className = 'dd-divider';
      const logoutItem = profilePanel.querySelector('[data-action="logout"]');
      const insertNode = node => logoutItem ? profilePanel.insertBefore(node, logoutItem) : profilePanel.appendChild(node);

      insertNode(divider);
      otherRoles.forEach(roleKey => {
        const info = ROLE_INFO[roleKey];
        const link = document.createElement('a');
        link.className = 'dd-item dd-dashboard-switch';
        link.href = info.href;
        link.dataset.dashboardSwitch = '1';
        link.innerHTML = `
          <i class="fa-solid ${info.icon}"></i>
          <div><span class="t">Switch to ${info.label} Dashboard</span><span class="s">${info.sub}</span></div>`;
        insertNode(link);
      });
    }
  }

  /* Close any open dropdown on outside click / Escape */
  document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown-panel.open, .action-dropdown.open')
      .forEach(p => p.classList.remove('open'));
  });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    document.querySelectorAll('.dropdown-panel.open, .action-dropdown.open')
      .forEach(p => p.classList.remove('open'));
    document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
    closeSidebar();
  });

  /* Logout */
  document.querySelectorAll('[data-action="logout"]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      if (confirm('Are you sure you want to log out?')) {
        JP.toast('You have been logged out.');
      }
    });
  });

  /* Global search in the top bar */
  const globalSearch = document.getElementById('globalSearch');
  globalSearch && globalSearch.addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      JP.toast(`Searching for "${e.target.value.trim()}"...`);
    }
  });

  /* Generic modal wiring: [data-modal-open="id"] / [data-modal-close] */
  document.querySelectorAll('[data-modal-open]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = document.getElementById(btn.dataset.modalOpen);
      modal && modal.classList.add('open');
    });
  });
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('mousedown', e => {
      if (e.target === overlay) overlay.classList.remove('open');
    });
    overlay.querySelectorAll('[data-modal-close]').forEach(btn => {
      btn.addEventListener('click', () => overlay.classList.remove('open'));
    });
  });

  /* Placeholder links — show coming-soon popup instead of navigating */
  document.querySelectorAll('a[href="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      if (a.dataset.silent !== undefined) return;

      const sidebarLink = a.closest('.sidebar-nav .nav-item');
      if (sidebarLink) {
        const label = sidebarLink.textContent.replace(/\s+/g, ' ').trim();
        JP.comingSoon(label, 'page');
        closeSidebar();
        return;
      }

      if (a.classList.contains('view-all') || a.classList.contains('view-all-link')) {
        const panel = a.closest('.panel, .stat-card');
        const heading = panel?.querySelector('.panel-head h3, .stat-info .label');
        const label = heading?.textContent.replace(/\s+/g, ' ').trim() || 'This section';
        JP.comingSoon(label, 'section');
        return;
      }

      JP.comingSoon('', 'page');
    });
  });
});
