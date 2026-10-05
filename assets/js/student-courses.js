/* =========================================================
   Student — My Courses
   Tabs (All / In Progress / Completed), search, status filter,
   pagination, row actions
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  const tbody = document.getElementById('coursesBody');
  if (!tbody) return;

  const PER_PAGE = 8;
  let currentPage = 1;
  let activeTab = 'all';

  const tabs = document.querySelectorAll('.tab-item');
  const searchInput = document.getElementById('courseSearch');
  const statusFilter = document.getElementById('statusFilter');
  const showingLabel = document.getElementById('courseShowing');
  const pager = document.getElementById('coursePagination');

  const statusClass = s => s === 'Completed' ? 'green' : s === 'In Progress' ? 'orange' : 'gray';

  function filtered() {
    const q = (searchInput.value || '').trim().toLowerCase();
    return STUDENT.courses.filter(c => {
      const matchesTab = activeTab === 'all'
        || (activeTab === 'progress' && c.status === 'In Progress')
        || (activeTab === 'completed' && c.status === 'Completed');
      const matchesQuery = !q || c.title.toLowerCase().includes(q) || c.instructor.toLowerCase().includes(q);
      const matchesStatus = statusFilter.value === 'all' || c.status.toLowerCase() === statusFilter.value;
      return matchesTab && matchesQuery && matchesStatus;
    });
  }

  function formatLastAccessed(value) {
    if (!value || value === '—') return '<span class="text-muted">—</span>';
    const parts = value.match(/^(.+?\d{4})\s+(.+)$/);
    if (!parts) return `<span class="text-muted">${JP.escape(value)}</span>`;
    return `<span class="last-accessed"><span class="last-accessed__date">${JP.escape(parts[1])}</span><span class="last-accessed__time">${JP.escape(parts[2])}</span></span>`;
  }

  function actionButton(course) {
    if (course.status === 'Completed') return `<button class="btn btn-outline btn-sm btn-course-action" data-continue="${JP.escape(course.title)}">Review Course</button>`;
    if (course.status === 'Not Started') return `<button class="btn btn-primary btn-sm btn-course-action" data-continue="${JP.escape(course.title)}">Start Course</button>`;
    return `<button class="btn btn-primary btn-sm btn-course-action" data-continue="${JP.escape(course.title)}">Continue</button>`;
  }

  function render() {
    const rows = filtered();
    const totalPages = Math.max(1, Math.ceil(rows.length / PER_PAGE));
    if (currentPage > totalPages) currentPage = totalPages;
    const start = (currentPage - 1) * PER_PAGE;
    const pageRows = rows.slice(start, start + PER_PAGE);

    if (!pageRows.length) {
      tbody.innerHTML = `<tr><td colspan="5">
        <div class="empty-state">
          <i class="fa-regular fa-folder-open"></i>
          <div>No courses match your filters.</div>
        </div></td></tr>`;
    } else {
      tbody.innerHTML = pageRows.map((c, i) => `
        <tr>
          <td>
            <div class="cell-course">
              ${STUDENT.thumb(c.title, 'md')}
              <div>
                <div class="cc-title">${JP.escape(c.title)}</div>
                <div class="cc-sub">By ${JP.escape(c.instructor)}</div>
              </div>
            </div>
          </td>
          <td>
            <div class="progress-cell">
              <div class="progress-track"><div class="progress-fill" style="width:${c.progress}%"></div></div>
              <div class="progress-pct">${c.progress}%</div>
            </div>
          </td>
          <td><span class="badge-status ${statusClass(c.status)}">${c.status}</span></td>
          <td>${formatLastAccessed(c.lastAccessed)}</td>
          <td class="td-actions">
            <div class="row-actions">
              ${actionButton(c)}
              <div class="action-menu">
                <button class="action-dots" data-row-menu="${i}" title="More"><i class="fa-solid fa-ellipsis-vertical"></i></button>
                <div class="action-dropdown" id="courseMenu-${i}">
                  <button data-info="${JP.escape(c.title)}"><i class="fa-regular fa-circle-question"></i> Course Details</button>
                  <button data-syllabus="${JP.escape(c.title)}"><i class="fa-regular fa-file-lines"></i> View Syllabus</button>
                </div>
              </div>
            </div>
          </td>
        </tr>`).join('');
    }

    const from = rows.length ? start + 1 : 0;
    const to = Math.min(start + PER_PAGE, rows.length);
    showingLabel.textContent = `Showing ${from} to ${to} of ${rows.length} courses`;

    pager.style.display = totalPages <= 1 ? 'none' : '';
    JP.renderPagination(pager, currentPage, totalPages, page => { currentPage = page; render(); });
    wireRowActions();
  }

  function wireRowActions() {
    tbody.querySelectorAll('[data-continue]').forEach(btn =>
      btn.addEventListener('click', () => JP.comingSoon(`${btn.dataset.continue} — Course Player`, 'page')));

    tbody.querySelectorAll('[data-row-menu]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const menu = document.getElementById('courseMenu-' + btn.dataset.rowMenu);
        const wasOpen = menu.classList.contains('open');
        document.querySelectorAll('.action-dropdown.open').forEach(m => m.classList.remove('open'));
        if (!wasOpen) menu.classList.add('open');
      });
    });
    tbody.querySelectorAll('[data-info]').forEach(btn =>
      btn.addEventListener('click', () => { document.querySelectorAll('.action-dropdown.open').forEach(m => m.classList.remove('open')); JP.comingSoon(`${btn.dataset.info} — Course Details`, 'page'); }));
    tbody.querySelectorAll('[data-syllabus]').forEach(btn =>
      btn.addEventListener('click', () => { document.querySelectorAll('.action-dropdown.open').forEach(m => m.classList.remove('open')); JP.comingSoon(`${btn.dataset.syllabus} — Syllabus`, 'page'); }));
  }

  tabs.forEach(tab => tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    activeTab = tab.dataset.tab;
    currentPage = 1;
    render();
  }));

  let debounce;
  searchInput.addEventListener('input', () => { clearTimeout(debounce); debounce = setTimeout(() => { currentPage = 1; render(); }, 180); });
  statusFilter.addEventListener('change', () => { currentPage = 1; render(); });

  render();
});
