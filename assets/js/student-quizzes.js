/* =========================================================
   Student — My Quizzes
   Tabs (All Quizzes / Submitted), search, course filter,
   pagination, download, and an Upload Answer flow that
   actually updates the Submitted tab.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  const allBody = document.getElementById('allQuizzesBody');
  if (!allBody) return;

  const quizzes = STUDENT.quizzes; // shared, mutable in place

  const PER_PAGE = 8;
  let currentPage = 1;
  let activeTab = 'all';

  const tabs = document.querySelectorAll('.tab-item');
  const searchInput = document.getElementById('quizSearch');
  const courseFilter = document.getElementById('courseFilter');
  const showingLabel = document.getElementById('quizShowing');
  const pager = document.getElementById('quizPagination');
  const allTable = document.getElementById('allQuizzesTable');
  const submittedTable = document.getElementById('submittedQuizzesTable');
  const submittedBody = document.getElementById('submittedQuizzesBody');

  const fillOnce = () => {
    const courses = [...new Set(quizzes.map(q => q.course))].sort();
    courseFilter.innerHTML = '<option value="all">All Courses</option>' +
      courses.map(c => `<option value="${JP.escape(c)}">${JP.escape(c)}</option>`).join('');
  };
  fillOnce();

  function filtered() {
    const q = (searchInput.value || '').trim().toLowerCase();
    return quizzes.filter(quiz =>
      (!q || quiz.title.toLowerCase().includes(q) || quiz.course.toLowerCase().includes(q)) &&
      (courseFilter.value === 'all' || quiz.course === courseFilter.value) &&
      (activeTab === 'all' || (activeTab === 'submitted' && quiz.submission))
    );
  }

  function render() {
    const rows = filtered();
    const totalPages = Math.max(1, Math.ceil(rows.length / PER_PAGE));
    if (currentPage > totalPages) currentPage = totalPages;
    const start = (currentPage - 1) * PER_PAGE;
    const pageRows = rows.slice(start, start + PER_PAGE);

    allTable.style.display = activeTab === 'all' ? '' : 'none';
    submittedTable.style.display = activeTab === 'submitted' ? '' : 'none';

    if (!pageRows.length) {
      const colSpan = activeTab === 'all' ? 5 : 6;
      const emptyRow = `<tr><td colspan="${colSpan}"><div class="empty-state"><i class="fa-regular fa-file-lines"></i><div>No quizzes match your filters.</div></div></td></tr>`;
      allBody.innerHTML = activeTab === 'all' ? emptyRow : '';
      submittedBody.innerHTML = activeTab === 'submitted' ? emptyRow : '';
    } else if (activeTab === 'all') {
      allBody.innerHTML = pageRows.map(quiz => {
        const idx = quizzes.indexOf(quiz);
        return `
        <tr>
          <td>
            <div class="quiz-cell">
              <div class="quiz-cell__icon"><i class="fa-regular fa-file-lines"></i></div>
              <div class="quiz-cell__text">
                <div class="quiz-cell__title">${JP.escape(quiz.title)}</div>
                <div class="quiz-cell__meta">${quiz.questions} questions</div>
              </div>
            </div>
          </td>
          <td>${JP.escape(quiz.course)}</td>
          <td class="text-muted">${JP.escape(quiz.uploadedOn)}</td>
          <td class="text-muted">${JP.escape(quiz.dueDate)}</td>
          <td class="td-actions">
            <div class="row-actions">
              <button class="btn btn-outline btn-sm btn-quiz-download" data-download="${idx}"><i class="fa-solid fa-download"></i> Download</button>
              <button class="btn btn-primary btn-sm btn-quiz-upload" data-upload="${idx}"><i class="fa-solid fa-upload"></i> Upload Answer</button>
              <div class="action-menu">
                <button class="action-dots" data-row-menu="${idx}" title="More"><i class="fa-solid fa-ellipsis-vertical"></i></button>
                <div class="action-dropdown" id="quizMenu-${idx}">
                  <button data-instructions="${idx}"><i class="fa-regular fa-circle-question"></i> View Instructions</button>
                </div>
              </div>
            </div>
          </td>
        </tr>`;
      }).join('');
      submittedBody.innerHTML = '';
    } else {
      submittedBody.innerHTML = pageRows.map(quiz => {
        const idx = quizzes.indexOf(quiz);
        const s = quiz.submission;
        return `
        <tr>
          <td>
            <div class="quiz-cell">
              <div class="quiz-cell__icon"><i class="fa-regular fa-file-lines"></i></div>
              <div class="quiz-cell__text">
                <div class="quiz-cell__title">${JP.escape(quiz.title)}</div>
                <div class="quiz-cell__meta">${quiz.questions} questions</div>
              </div>
            </div>
          </td>
          <td>${JP.escape(quiz.course)}</td>
          <td class="text-muted">${JP.escape(s.submittedOn)}</td>
          <td>
            <div class="quiz-file-chip">
              <div class="quiz-file-chip__icon"><i class="fa-solid fa-file-word"></i></div>
              <div>
                <div class="quiz-file-chip__name">${JP.escape(s.file)}</div>
                <div class="quiz-file-chip__size">${JP.escape(s.size)}</div>
              </div>
            </div>
          </td>
          <td><span class="badge-status green">${s.status}</span></td>
          <td class="td-actions">
            <div class="row-actions">
              <button class="btn btn-outline btn-sm btn-quiz-download" data-view="${idx}" title="View submission"><i class="fa-regular fa-eye"></i> View</button>
              <button class="btn btn-primary btn-sm btn-quiz-upload" data-sub-download="${idx}"><i class="fa-solid fa-download"></i> Download</button>
            </div>
          </td>
        </tr>`;
      }).join('');
      allBody.innerHTML = '';
    }

    const from = rows.length ? start + 1 : 0;
    const to = Math.min(start + PER_PAGE, rows.length);
    const noun = activeTab === 'submitted' ? 'submitted quizzes' : 'quizzes';
    showingLabel.textContent = `Showing ${from} to ${to} of ${rows.length} ${noun}`;

    pager.style.display = totalPages <= 1 ? 'none' : '';
    JP.renderPagination(pager, currentPage, totalPages, page => { currentPage = page; render(); });
    wireRowActions();
  }

  function wireRowActions() {
    allBody.querySelectorAll('[data-download]').forEach(b => b.addEventListener('click', () => downloadQuizFile(quizzes[Number(b.dataset.download)])));
    allBody.querySelectorAll('[data-upload]').forEach(b => b.addEventListener('click', () => openUploadModal(Number(b.dataset.upload))));
    allBody.querySelectorAll('[data-row-menu]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const menu = document.getElementById('quizMenu-' + btn.dataset.rowMenu);
        const wasOpen = menu.classList.contains('open');
        document.querySelectorAll('.action-dropdown.open').forEach(m => m.classList.remove('open'));
        if (!wasOpen) menu.classList.add('open');
      });
    });
    allBody.querySelectorAll('[data-instructions]').forEach(b =>
      b.addEventListener('click', () => { document.querySelectorAll('.action-dropdown.open').forEach(m => m.classList.remove('open')); JP.comingSoon(`${quizzes[Number(b.dataset.instructions)].title} — Instructions`, 'page'); }));

    submittedBody.querySelectorAll('[data-view]').forEach(b => b.addEventListener('click', () => openViewModal(quizzes[Number(b.dataset.view)])));
    submittedBody.querySelectorAll('[data-sub-download]').forEach(b => b.addEventListener('click', () => downloadAnswerFile(quizzes[Number(b.dataset.subDownload)])));
  }

  function downloadQuizFile(quiz) {
    const content = `${quiz.title}\r\nCourse: ${quiz.course}\r\n${quiz.questions} questions\r\nDue: ${quiz.dueDate}\r\n\r\nThis is a placeholder for the downloadable quiz document.`;
    JP.download(quiz.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.txt', content);
    JP.toast(`Downloading "${quiz.title}"...`);
  }

  function downloadAnswerFile(quiz) {
    const s = quiz.submission;
    const content = `Quiz: ${quiz.title}\r\nCourse: ${quiz.course}\r\nSubmitted On: ${s.submittedOn}\r\n\r\nThis is a placeholder for your submitted answer file "${s.file}".`;
    JP.download(s.file.replace(/\.docx?$/, '') + '.txt', content);
    JP.toast(`Downloading ${s.file}...`);
  }

  /* ---------------- View submission modal ---------------- */
  const viewModal = document.getElementById('quizViewModal');
  const viewBody = document.getElementById('quizViewBody');
  let activeViewQuiz = null;

  function openViewModal(quiz) {
    activeViewQuiz = quiz;
    const s = quiz.submission;
    viewBody.innerHTML = `
      <div class="file-chip" style="margin-bottom:18px">
        <div class="ficon docx" style="width:44px;height:44px;font-size:18px"><i class="fa-solid fa-file-word"></i></div>
        <div class="ftext"><div class="fname" style="font-size:15px">${JP.escape(s.file)}</div><div class="fsize">${JP.escape(s.size)}</div></div>
      </div>
      <div class="form-grid" style="margin-bottom:0">
        <div class="form-group"><label>Quiz</label><div class="text-muted">${JP.escape(quiz.title)}</div></div>
        <div class="form-group"><label>Course</label><div class="text-muted">${JP.escape(quiz.course)}</div></div>
        <div class="form-group"><label>Submitted On</label><div class="text-muted">${JP.escape(s.submittedOn)}</div></div>
        <div class="form-group"><label>Status</label><span class="badge-status green">${s.status}</span></div>
      </div>`;
    viewModal.classList.add('open');
  }
  document.getElementById('quizViewDownload').addEventListener('click', () => activeViewQuiz && downloadAnswerFile(activeViewQuiz));

  /* ---------------- Upload Answer modal ---------------- */
  const uploadModal = document.getElementById('uploadAnswerModal');
  const uploadSubtitle = document.getElementById('uploadAnswerSubtitle');
  const drop = document.getElementById('answerDrop');
  const fileInput = document.getElementById('answerFileInput');
  const fileError = document.getElementById('answerFileError');
  const submitBtn = document.getElementById('answerSubmitBtn');
  let activeUploadIdx = null;

  function openUploadModal(idx) {
    activeUploadIdx = idx;
    uploadSubtitle.textContent = `Upload your completed answer for "${quizzes[idx].title}".`;
    resetUploadForm();
    uploadModal.classList.add('open');
  }

  function resetUploadForm() {
    fileInput.value = '';
    fileError.textContent = '';
    const preview = drop.querySelector('.drop-preview');
    if (preview) preview.remove();
    drop.querySelector('.drop-default').style.display = '';
  }

  function showFile(file) {
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    fileError.textContent = '';
    if (!['doc', 'docx', 'pdf'].includes(ext)) { fileError.textContent = 'Only DOC, DOCX or PDF files are allowed.'; fileInput.value = ''; return; }
    if (file.size > 25 * 1024 * 1024) { fileError.textContent = 'File must be 25MB or smaller.'; fileInput.value = ''; return; }

    drop.querySelector('.drop-default').style.display = 'none';
    let holder = drop.querySelector('.drop-preview');
    if (!holder) { holder = document.createElement('div'); holder.className = 'drop-preview'; drop.insertBefore(holder, fileInput); }
    const kb = (file.size / 1024).toFixed(1);
    holder.innerHTML = `<i class="fa-solid fa-file-circle-check" style="font-size:20px;color:#1f6b4f;display:block;margin-bottom:6px"></i>
                        <div class="file-name">${JP.escape(file.name)}</div>
                        <div class="text-muted" style="font-size:11.5px">${kb} KB</div>`;
  }
  fileInput.addEventListener('change', () => showFile(fileInput.files[0]));
  ['dragenter', 'dragover'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add('dragover'); }));
  ['dragleave', 'drop'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove('dragover'); }));
  drop.addEventListener('drop', e => { const file = e.dataTransfer.files[0]; if (file) { fileInput.files = e.dataTransfer.files; showFile(file); } });

  submitBtn.addEventListener('click', () => {
    if (activeUploadIdx === null) return;
    const file = fileInput.files[0];
    if (!file) { fileError.textContent = 'Please choose a file to upload.'; return; }

    const quiz = quizzes[activeUploadIdx];
    const now = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    quiz.submission = {
      file: file.name,
      size: (file.size / 1024).toFixed(1) + ' KB',
      submittedOn: now,
      status: 'Submitted'
    };

    uploadModal.classList.remove('open');
    JP.toast(`Answer submitted for "${quiz.title}".`);
    render();
  });

  /* ---------------- filters/tabs ---------------- */
  tabs.forEach(tab => tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    activeTab = tab.dataset.tab;
    currentPage = 1;
    render();
  }));

  let debounce;
  searchInput.addEventListener('input', () => { clearTimeout(debounce); debounce = setTimeout(() => { currentPage = 1; render(); }, 180); });
  courseFilter.addEventListener('change', () => { currentPage = 1; render(); });

  render();
});
