/* =========================================================
   Uploader — Submissions list
   Search / course / quiz / student / status filters,
   pagination, preview modal, download and CSV export.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  const QUIZ_COURSE_PAIRS = [
    { quiz: 'The Science of Self-Compassion Quiz', course: 'The Science of Self-Compassion' },
    { quiz: 'Developing a Growth Mindset Quiz',     course: 'Developing a Growth Mindset' },
    { quiz: 'Crisis Management in Schools Quiz',    course: 'Crisis Management in Schools' },
    { quiz: 'Overcoming Procrastination Quiz',      course: 'Overcoming Procrastination' },
    { quiz: 'The Power of Gratitude Quiz',          course: 'The Power of Gratitude' }
  ];

  const students = [
    'John Smith', 'Sarah Brown', 'Michael Lee', 'Emily Davis', 'David Wilson',
    'Olivia Bennett', 'Marcus Reid', 'Hannah Powell', 'Andre Campbell', 'Grace Thompson',
    'Peter Nolan', 'Rachel Gordon', 'Tyrone Walters', 'Melissa Cole', 'Jason Fleming',
    'Chloe Barrett', 'Ian Mitchell', 'Sophia Ellis', 'Natalie Foster', 'Kevin Brooks',
    'Christopher Bell', 'Daniel Martinez', 'Amanda White', 'Jessica Clark', 'Robert Anderson',
    'Sarah Johnson', 'Nadine Fowler', 'Trevor Campbell'
  ];

  const dates = [
    'May 20, 2024 10:30 AM', 'May 20, 2024 09:15 AM', 'May 18, 2024 02:45 PM', 'May 15, 2024 11:20 AM',
    'May 12, 2024 04:10 PM', 'May 10, 2024 08:05 AM', 'May 08, 2024 01:40 PM', 'May 05, 2024 03:25 PM',
    'May 02, 2024 09:50 AM', 'Apr 29, 2024 12:15 PM', 'Apr 26, 2024 05:30 PM', 'Apr 23, 2024 10:00 AM',
    'Apr 20, 2024 02:20 PM', 'Apr 17, 2024 11:45 AM', 'Apr 14, 2024 04:55 PM', 'Apr 11, 2024 09:10 AM',
    'Apr 08, 2024 01:05 PM', 'Apr 05, 2024 03:35 PM', 'Apr 02, 2024 10:50 AM', 'Mar 30, 2024 12:40 PM',
    'Mar 27, 2024 02:15 PM', 'Mar 24, 2024 09:30 AM', 'Mar 21, 2024 04:05 PM', 'Mar 18, 2024 11:10 AM',
    'Mar 15, 2024 01:55 PM', 'Mar 12, 2024 03:20 PM', 'Mar 09, 2024 10:45 AM', 'Mar 06, 2024 12:30 PM'
  ];

  function makeFile(name, i) {
    const isImage = i % 4 === 1;
    const slug = name.toLowerCase().replace(/[^a-z]+/g, '_');
    return {
      name: `${slug}_answer.${isImage ? 'jpg' : 'pdf'}`,
      size: (1 + (i % 5) * 0.4).toFixed(1) + ' MB',
      type: isImage ? 'img' : 'pdf'
    };
  }

  const submissions = students.map((student, i) => {
    const pair = QUIZ_COURSE_PAIRS[i % QUIZ_COURSE_PAIRS.length];
    const file = makeFile(student, i);
    return {
      student,
      email: student.toLowerCase().replace(/\s+/g, '.') + '@email.com',
      quiz: pair.quiz,
      course: pair.course,
      date: dates[i % dates.length],
      file: file.name,
      size: file.size,
      fileType: file.type,
      status: (i % 7 === 3) ? 'Late' : 'Submitted'
    };
  });

  const PER_PAGE = 5;
  let currentPage = 1;

  const tbody = document.getElementById('submissionsBody');
  const searchInput = document.getElementById('subSearch');
  const courseFilter = document.getElementById('courseFilter');
  const quizFilter = document.getElementById('quizFilter');
  const studentFilter = document.getElementById('studentFilter');
  const statusFilter = document.getElementById('statusFilter');
  const resetBtn = document.getElementById('resetFilters');
  const showingLabel = document.getElementById('subShowing');
  const pager = document.getElementById('subPagination');
  if (!tbody) return;

  const fillOnce = (select, values) => {
    values.forEach(v => {
      const opt = document.createElement('option');
      opt.value = v;
      opt.textContent = v;
      select.appendChild(opt);
    });
  };
  fillOnce(courseFilter, [...new Set(submissions.map(s => s.course))]);
  fillOnce(quizFilter, [...new Set(submissions.map(s => s.quiz))]);
  fillOnce(studentFilter, [...new Set(submissions.map(s => s.student))].sort());

  function filtered() {
    const q = (searchInput.value || '').trim().toLowerCase();
    return submissions.filter(s =>
      (!q || s.student.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.quiz.toLowerCase().includes(q)) &&
      (courseFilter.value === 'all' || s.course === courseFilter.value) &&
      (quizFilter.value === 'all' || s.quiz === quizFilter.value) &&
      (studentFilter.value === 'all' || s.student === studentFilter.value) &&
      (statusFilter.value === 'all' || s.status.toLowerCase() === statusFilter.value)
    );
  }

  function render() {
    const rows = filtered();
    const totalPages = Math.max(1, Math.ceil(rows.length / PER_PAGE));
    if (currentPage > totalPages) currentPage = totalPages;
    const start = (currentPage - 1) * PER_PAGE;
    const pageRows = rows.slice(start, start + PER_PAGE);

    if (!pageRows.length) {
      tbody.innerHTML = `<tr><td colspan="7">
        <div class="empty-state">
          <i class="fa-regular fa-folder-open"></i>
          <div>No submissions match your filters.</div>
        </div></td></tr>`;
    } else {
      tbody.innerHTML = pageRows.map(s => {
        const idx = submissions.indexOf(s);
        const ficon = s.fileType === 'pdf' ? { cls: 'pdf', icon: 'fa-file-pdf' } : { cls: 'img', icon: 'fa-file-image' };
        return `
        <tr>
          <td>
            <div class="cell-person">
              ${JP.avatar(s.student)}
              <div><div class="pname">${JP.escape(s.student)}</div><div class="psub">${JP.escape(s.email)}</div></div>
            </div>
          </td>
          <td>${JP.escape(s.quiz)}</td>
          <td class="text-muted">${JP.escape(s.course)}</td>
          <td class="text-muted">${JP.escape(s.date)}</td>
          <td>
            <div class="file-chip">
              <div class="ficon ${ficon.cls}"><i class="fa-solid ${ficon.icon}"></i></div>
              <div class="ftext"><div class="fname">${JP.escape(s.file)}</div><div class="fsize">${JP.escape(s.size)}</div></div>
            </div>
          </td>
          <td><span class="badge-status ${s.status === 'Submitted' ? 'green' : 'orange'}">${s.status}</span></td>
          <td style="white-space:nowrap">
            <button class="icon-action" data-view="${idx}" title="View"><i class="fa-regular fa-eye"></i></button>
            <button class="icon-action" data-download="${idx}" title="Download"><i class="fa-solid fa-download"></i></button>
          </td>
        </tr>`;
      }).join('');
    }

    const from = rows.length ? start + 1 : 0;
    const to = Math.min(start + PER_PAGE, rows.length);
    showingLabel.textContent = `Showing ${from} to ${to} of ${rows.length} submissions`;

    JP.renderPagination(pager, currentPage, totalPages, page => { currentPage = page; render(); });

    tbody.querySelectorAll('[data-view]').forEach(b => b.addEventListener('click', () => openPreview(submissions[Number(b.dataset.view)])));
    tbody.querySelectorAll('[data-download]').forEach(b => b.addEventListener('click', () => downloadSubmission(submissions[Number(b.dataset.download)])));
  }

  /* ---------------- preview modal ---------------- */
  const modal = document.getElementById('subPreviewModal');
  const body = document.getElementById('subPreviewBody');
  let active = null;

  function openPreview(s) {
    active = s;
    const ficon = s.fileType === 'pdf' ? { cls: 'pdf', icon: 'fa-file-pdf' } : { cls: 'img', icon: 'fa-file-image' };
    body.innerHTML = `
      <div class="file-chip" style="margin-bottom:18px">
        <div class="ficon ${ficon.cls}" style="width:44px;height:44px;font-size:18px"><i class="fa-solid ${ficon.icon}"></i></div>
        <div class="ftext"><div class="fname" style="font-size:15px">${JP.escape(s.file)}</div><div class="fsize">${JP.escape(s.size)}</div></div>
      </div>
      <div class="form-grid" style="margin-bottom:0">
        <div class="form-group"><label>Student</label><div class="text-muted">${JP.escape(s.student)} (${JP.escape(s.email)})</div></div>
        <div class="form-group"><label>Quiz</label><div class="text-muted">${JP.escape(s.quiz)}</div></div>
        <div class="form-group"><label>Course</label><div class="text-muted">${JP.escape(s.course)}</div></div>
        <div class="form-group"><label>Submitted On</label><div class="text-muted">${JP.escape(s.date)}</div></div>
        <div class="form-group"><label>Status</label><span class="badge-status ${s.status === 'Submitted' ? 'green' : 'orange'}">${s.status}</span></div>
      </div>`;
    modal.classList.add('open');
  }

  function downloadSubmission(s) {
    const content = `Student: ${s.student} (${s.email})\r\nQuiz: ${s.quiz}\r\nCourse: ${s.course}\r\nSubmitted On: ${s.date}\r\n\r\nThis is a placeholder for the submitted file "${s.file}".`;
    JP.download(s.file.replace(/\.(pdf|jpe?g)$/i, '') + '.txt', content);
    JP.toast(`Downloading ${s.file}...`);
  }

  document.getElementById('subPreviewDownload').addEventListener('click', () => active && downloadSubmission(active));

  /* ---------------- export ---------------- */
  document.getElementById('exportBtn').addEventListener('click', () => {
    const rows = filtered().map(s => [s.student, s.email, s.quiz, s.course, s.date, s.file, s.status]);
    if (!rows.length) return JP.toast('Nothing to export for the current filters.', 'error');
    JP.exportCsv('jampsych-submissions.csv',
      ['Student', 'Email', 'Quiz', 'Course', 'Submitted On', 'File', 'Status'], rows);
    JP.toast(`Exported ${rows.length} submission${rows.length === 1 ? '' : 's'} to CSV.`);
  });

  /* ---------------- filters ---------------- */
  let debounce;
  searchInput.addEventListener('input', () => { clearTimeout(debounce); debounce = setTimeout(() => { currentPage = 1; render(); }, 180); });
  [courseFilter, quizFilter, studentFilter, statusFilter].forEach(sel =>
    sel.addEventListener('change', () => { currentPage = 1; render(); }));
  resetBtn.addEventListener('click', () => {
    searchInput.value = '';
    [courseFilter, quizFilter, studentFilter, statusFilter].forEach(sel => sel.value = 'all');
    currentPage = 1;
    render();
    JP.toast('Filters reset.');
  });

  render();
});
