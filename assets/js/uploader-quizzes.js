/* =========================================================
   Uploader — Quizzes list
   Search / course & status filters / pagination / row actions
   Picks up a quiz handed off from the dashboard modal or the
   "Upload New Quiz" page via localStorage.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  let quizzes = [
    { title: 'The Science of Self-Compassion Quiz', course: 'The Science of Self-Compassion', file: 'self-compassion-quiz.docx',  size: '24.5 KB', date: 'May 20, 2024', status: 'Published' },
    { title: 'Developing a Growth Mindset Quiz',     course: 'Developing a Growth Mindset',     file: 'growth-mindset-quiz.docx',   size: '28.1 KB', date: 'May 10, 2024', status: 'Published' },
    { title: 'Crisis Management in Schools Quiz',    course: 'Crisis Management in Schools',    file: 'crisis-management-quiz.docx',size: '30.3 KB', date: 'Apr 18, 2024', status: 'Published' },
    { title: 'Overcoming Procrastination Quiz',      course: 'Overcoming Procrastination',      file: 'procrastination-quiz.docx',  size: '22.7 KB', date: 'Apr 15, 2024', status: 'Draft' },
    { title: 'The Power of Gratitude Quiz',          course: 'The Power of Gratitude',          file: 'power-gratitude-quiz.docx',  size: '26.4 KB', date: 'Mar 20, 2024', status: 'Published' }
  ];

  /* pick up a quiz created on the Dashboard modal or the Upload New Quiz page */
  (function absorbPendingQuiz() {
    const raw = localStorage.getItem('jp_pending_quiz');
    if (!raw) return;
    try {
      const pending = JSON.parse(raw);
      quizzes.unshift({
        title: pending.title.toLowerCase().endsWith('quiz') ? pending.title : pending.title + ' Quiz',
        course: pending.course || 'General',
        file: pending.file || 'new-quiz.docx',
        size: pending.size || '—',
        date: pending.date || new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        status: pending.status || 'Published'
      });
      setTimeout(() => JP.toast(`New quiz "${pending.title}" was added.`), 300);
    } catch (e) { /* ignore malformed payload */ }
    localStorage.removeItem('jp_pending_quiz');
  })();

  const PER_PAGE = 8;
  let currentPage = 1;

  const tbody = document.getElementById('quizzesBody');
  const searchInput = document.getElementById('quizSearch');
  const courseFilter = document.getElementById('courseFilter');
  const statusFilter = document.getElementById('statusFilter');
  const resetBtn = document.getElementById('resetFilters');
  const showingLabel = document.getElementById('quizShowing');
  const pager = document.getElementById('quizPagination');
  if (!tbody) return;

  function refreshCourseOptions() {
    const current = courseFilter.value;
    const courses = [...new Set(quizzes.map(q => q.course))].sort();
    courseFilter.innerHTML = '<option value="all">All Courses</option>' +
      courses.map(c => `<option value="${JP.escape(c)}">${JP.escape(c)}</option>`).join('');
    if (courses.includes(current)) courseFilter.value = current;
  }

  function filtered() {
    const q = (searchInput.value || '').trim().toLowerCase();
    return quizzes.filter(quiz =>
      (!q || quiz.title.toLowerCase().includes(q) || quiz.course.toLowerCase().includes(q)) &&
      (courseFilter.value === 'all' || quiz.course === courseFilter.value) &&
      (statusFilter.value === 'all' || quiz.status.toLowerCase() === statusFilter.value)
    );
  }

  function render() {
    refreshCourseOptions();
    const rows = filtered();
    const totalPages = Math.max(1, Math.ceil(rows.length / PER_PAGE));
    if (currentPage > totalPages) currentPage = totalPages;
    const start = (currentPage - 1) * PER_PAGE;
    const pageRows = rows.slice(start, start + PER_PAGE);

    if (!pageRows.length) {
      tbody.innerHTML = `<tr><td colspan="6">
        <div class="empty-state">
          <i class="fa-regular fa-file-lines"></i>
          <div>No quizzes match your filters.</div>
        </div></td></tr>`;
    } else {
      tbody.innerHTML = pageRows.map(quiz => {
        const idx = quizzes.indexOf(quiz);
        return `
        <tr>
          <td><span class="pname" style="font-weight:600">${JP.escape(quiz.title)}</span></td>
          <td class="text-muted">${JP.escape(quiz.course)}</td>
          <td>
            <div class="file-chip">
              <div class="ficon docx"><i class="fa-solid fa-file-word"></i></div>
              <div class="ftext">
                <div class="fname">${JP.escape(quiz.file)}</div>
                <div class="fsize">${JP.escape(quiz.size)}</div>
              </div>
            </div>
          </td>
          <td class="text-muted">${JP.escape(quiz.date)}</td>
          <td><span class="badge-status ${quiz.status === 'Published' ? 'green' : 'orange'}">${quiz.status}</span></td>
          <td style="white-space:nowrap">
            <button class="icon-action" data-view="${idx}" title="View"><i class="fa-regular fa-eye"></i></button>
            <button class="icon-action" data-download="${idx}" title="Download"><i class="fa-solid fa-download"></i></button>
            <div class="action-menu" style="display:inline-block">
              <button class="action-dots" data-row-menu="${idx}" title="More"><i class="fa-solid fa-ellipsis-vertical"></i></button>
              <div class="action-dropdown" id="quizMenu-${idx}">
                <button data-act="toggle" data-idx="${idx}"><i class="fa-solid fa-rotate"></i> ${quiz.status === 'Published' ? 'Move to Draft' : 'Publish'}</button>
                <button data-act="duplicate" data-idx="${idx}"><i class="fa-regular fa-copy"></i> Duplicate</button>
                <button data-act="delete" data-idx="${idx}" class="danger"><i class="fa-regular fa-trash-can"></i> Delete</button>
              </div>
            </div>
          </td>
        </tr>`;
      }).join('');
    }

    const from = rows.length ? start + 1 : 0;
    const to = Math.min(start + PER_PAGE, rows.length);
    showingLabel.textContent = `Showing ${from} to ${to} of ${rows.length} quizzes`;

    JP.renderPagination(pager, currentPage, totalPages, page => { currentPage = page; render(); });
    wireRowActions();
  }

  function wireRowActions() {
    tbody.querySelectorAll('[data-row-menu]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const menu = document.getElementById('quizMenu-' + btn.dataset.rowMenu);
        const wasOpen = menu.classList.contains('open');
        document.querySelectorAll('.action-dropdown.open').forEach(m => m.classList.remove('open'));
        if (!wasOpen) menu.classList.add('open');
      });
    });

    tbody.querySelectorAll('[data-act]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const idx = Number(btn.dataset.idx);
        const quiz = quizzes[idx];
        document.querySelectorAll('.action-dropdown.open').forEach(m => m.classList.remove('open'));

        if (btn.dataset.act === 'toggle') {
          quiz.status = quiz.status === 'Published' ? 'Draft' : 'Published';
          JP.toast(`"${quiz.title}" is now ${quiz.status.toLowerCase()}.`);
          render();
        } else if (btn.dataset.act === 'duplicate') {
          quizzes.splice(idx + 1, 0, { ...quiz, title: quiz.title + ' (Copy)', status: 'Draft', date: 'Today' });
          JP.toast(`Duplicated "${quiz.title}".`);
          render();
        } else if (btn.dataset.act === 'delete') {
          if (confirm(`Delete "${quiz.title}"? This cannot be undone.`)) {
            quizzes.splice(idx, 1);
            JP.toast('Quiz deleted.');
            render();
          }
        }
      });
    });

    tbody.querySelectorAll('[data-view]').forEach(b => b.addEventListener('click', () => openPreview(quizzes[Number(b.dataset.view)])));
    tbody.querySelectorAll('[data-download]').forEach(b => b.addEventListener('click', () => downloadQuiz(quizzes[Number(b.dataset.download)])));
  }

  /* ---------------- preview modal ---------------- */
  const modal = document.getElementById('quizPreviewModal');
  const body = document.getElementById('quizPreviewBody');
  let active = null;

  function openPreview(quiz) {
    active = quiz;
    body.innerHTML = `
      <div class="file-chip" style="margin-bottom:18px">
        <div class="ficon docx" style="width:44px;height:44px;font-size:18px"><i class="fa-solid fa-file-word"></i></div>
        <div class="ftext">
          <div class="fname" style="font-size:15px">${JP.escape(quiz.file)}</div>
          <div class="fsize">${JP.escape(quiz.size)}</div>
        </div>
      </div>
      <div class="form-grid" style="margin-bottom:0">
        <div class="form-group"><label>Quiz Title</label><div class="text-muted">${JP.escape(quiz.title)}</div></div>
        <div class="form-group"><label>Course</label><div class="text-muted">${JP.escape(quiz.course)}</div></div>
        <div class="form-group"><label>Uploaded On</label><div class="text-muted">${JP.escape(quiz.date)}</div></div>
        <div class="form-group"><label>Status</label><span class="badge-status ${quiz.status === 'Published' ? 'green' : 'orange'}">${quiz.status}</span></div>
      </div>`;
    modal.classList.add('open');
  }

  function downloadQuiz(quiz) {
    const content = `${quiz.title}\r\nCourse: ${quiz.course}\r\n\r\nThis is a placeholder for the uploaded Word document "${quiz.file}".\r\nIn production this action downloads the original .docx file.`;
    JP.download(quiz.file.replace(/\.docx?$/, '') + '.txt', content);
    JP.toast(`Downloading ${quiz.file}...`);
  }

  document.getElementById('quizPreviewDownload').addEventListener('click', () => active && downloadQuiz(active));

  /* ---------------- filters ---------------- */
  let debounce;
  searchInput.addEventListener('input', () => { clearTimeout(debounce); debounce = setTimeout(() => { currentPage = 1; render(); }, 180); });
  courseFilter.addEventListener('change', () => { currentPage = 1; render(); });
  statusFilter.addEventListener('change', () => { currentPage = 1; render(); });
  resetBtn.addEventListener('click', () => {
    searchInput.value = '';
    statusFilter.value = 'all';
    currentPage = 1;
    render();
    courseFilter.value = 'all';
    JP.toast('Filters reset.');
  });

  render();
});
