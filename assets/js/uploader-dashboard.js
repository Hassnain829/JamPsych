/* =========================================================
   Uploader Dashboard — charts, live stats/lists,
   and the "Add New Content" modal
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------
     State (kept in memory; Quizzes created here are also
     handed off to the Quizzes screen via localStorage)
     --------------------------------------------------------- */
  const state = {
    stats: { course: 18, workshop: 5, quiz: 12, material: 36 },
    recentContent: [
      { type: 'workshop', title: 'Mindfulness for Daily Life',      date: 'May 20, 2024' },
      { type: 'course',   title: 'The Science of Self-Compassion',  date: 'May 10, 2024' },
      { type: 'workshop', title: 'Building Emotional Resilience',   date: 'May 15, 2024' },
      { type: 'workshop', title: 'Stress Management Techniques',    date: 'Apr 28, 2024' },
      { type: 'course',   title: 'Developing a Growth Mindset',     date: 'Apr 22, 2024' }
    ],
    recentCourses: [
      { title: 'The Science of Self-Compassion', status: 'Published', date: 'May 10, 2024' },
      { title: 'Developing a Growth Mindset',     status: 'Published', date: 'Apr 22, 2024' },
      { title: 'Crisis Management in Schools',    status: 'Draft',     date: 'Apr 18, 2024' },
      { title: 'Overcoming Procrastination',      status: 'Published', date: 'Apr 15, 2024' },
      { title: 'The Power of Gratitude',          status: 'Draft',     date: 'Mar 20, 2024' }
    ],
    recentWorkshops: [
      { title: 'Positive Parenting Strategies',   status: 'Published', date: 'May 12, 2024' },
      { title: 'Stress Management Techniques',    status: 'Published', date: 'Apr 28, 2024' },
      { title: 'Building Emotional Resilience',   status: 'Draft',     date: 'Apr 15, 2024' },
      { title: 'Mindfulness for Daily Life',      status: 'Published', date: 'Apr 20, 2024' },
      { title: 'Effective Communication Skills',  status: 'Published', date: 'Apr 8, 2024' }
    ]
  };

  const TYPE_META = {
    course:   { icon: 'fa-solid fa-book-open',      cls: 'green',  label: 'Course' },
    workshop: { icon: 'fa-solid fa-chalkboard-user', cls: 'orange', label: 'Workshop' },
    quiz:     { icon: 'fa-regular fa-file-lines',    cls: 'blue',   label: 'Quiz' },
    material: { icon: 'fa-regular fa-folder-open',   cls: 'purple', label: 'Material' }
  };

  /* ---------------------------------------------------------
     Charts
     --------------------------------------------------------- */
  const contentData = {
    month:     { labels: ['May 1', 'May 6', 'May 11', 'May 16', 'May 21', 'May 26', 'May 31'], values: [10, 18, 15, 32, 22, 28, 26, 32, 38, 48] },
    lastMonth: { labels: ['Apr 1', 'Apr 6', 'Apr 11', 'Apr 16', 'Apr 21', 'Apr 26', 'Apr 30'], values: [6, 12, 10, 20, 16, 24, 20, 26, 30, 34] },
    year:      { labels: ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Dec'], values: [8, 14, 22, 30, 38, 34, 42, 46, 50, 48, 54, 60] }
  };

  const chartHost = document.getElementById('contentChart');
  const rangeSelect = document.getElementById('contentRange');
  let activeRange = 'month';

  const drawContentChart = () => JPCharts.renderLine(chartHost, {
    labels: contentData[activeRange].labels,
    values: contentData[activeRange].values,
    yStep: 10,
    color: '#1f6b4f',
    formatY: v => String(v),
    formatTip: v => `${v} items`
  });
  drawContentChart();

  rangeSelect && rangeSelect.addEventListener('change', e => {
    activeRange = contentData[e.target.value] ? e.target.value : 'month';
    drawContentChart();
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(drawContentChart, 150);
  });

  const donutHost = document.getElementById('contentDonut');
  const legendHost = document.getElementById('breakdownLegend');
  const donutTotal = document.getElementById('donutTotal');

  function redrawBreakdown() {
    const segments = [
      { key: 'course',   label: 'Courses',   color: '#1c9a5b', value: state.stats.course },
      { key: 'workshop', label: 'Workshops', color: '#e2a63c', value: state.stats.workshop },
      { key: 'quiz',     label: 'Quizzes',   color: '#3b82f6', value: state.stats.quiz },
      { key: 'material', label: 'Materials', color: '#8b5cf6', value: state.stats.material }
    ];
    const total = segments.reduce((s, x) => s + x.value, 0);
    donutTotal.textContent = total;
    JPCharts.renderDonut(donutHost, segments);

    legendHost.innerHTML = segments.map(s => `
      <div class="legend-item">
        <span class="legend-dot" style="background:${s.color}"></span>
        <div>
          <div class="lname">${s.label}</div>
          <div><span class="lval">${s.value}</span><span class="lpct">(${((s.value / total) * 100).toFixed(1)}%)</span></div>
        </div>
      </div>`).join('');
  }
  redrawBreakdown();

  /* ---------------------------------------------------------
     Stat cards
     --------------------------------------------------------- */
  function redrawStats() {
    document.getElementById('statCourses').textContent = state.stats.course;
    document.getElementById('statWorkshops').textContent = state.stats.workshop;
    document.getElementById('statQuizzes').textContent = state.stats.quiz;
    document.getElementById('statMaterials').textContent = state.stats.material;
  }

  /* ---------------------------------------------------------
     Lists
     --------------------------------------------------------- */
  function statusBadge(status) {
    return `<span class="badge-status ${status === 'Published' ? 'green' : 'orange'}" style="margin-top:0">${status}</span>`;
  }

  function redrawRecentContent() {
    const host = document.getElementById('recentContentList');
    host.innerHTML = state.recentContent.slice(0, 5).map(item => {
      const meta = TYPE_META[item.type];
      return `
      <div class="list-row">
        <div class="avatar stat-icon ${meta.cls}" style="width:38px;height:38px;border-radius:10px"><i class="${meta.icon}"></i></div>
        <div class="rinfo">
          <div class="rtitle">${JP.escape(item.title)}</div>
          <div class="rsub">${meta.label}</div>
        </div>
        <div><div class="ramount" style="font-weight:600;font-size:12px;color:var(--gray-500)">${JP.escape(item.date)}</div></div>
      </div>`;
    }).join('');
  }

  function redrawCourseWorkshopLists() {
    const courseHost = document.getElementById('recentCoursesList');
    courseHost.innerHTML = state.recentCourses.slice(0, 5).map(c => `
      <div class="list-row top-align">
        <div class="avatar stat-icon green" style="width:34px;height:34px;border-radius:9px"><i class="fa-solid fa-book-open"></i></div>
        <div class="rinfo"><div class="rtitle">${JP.escape(c.title)}</div></div>
        <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap;justify-content:flex-end">
          ${statusBadge(c.status)}
          <span class="text-muted" style="font-size:12px;white-space:nowrap">${JP.escape(c.date)}</span>
        </div>
      </div>`).join('');

    const workshopHost = document.getElementById('recentWorkshopsList');
    workshopHost.innerHTML = state.recentWorkshops.slice(0, 5).map(w => `
      <div class="list-row top-align">
        <div class="avatar stat-icon orange" style="width:34px;height:34px;border-radius:9px"><i class="fa-solid fa-chalkboard-user"></i></div>
        <div class="rinfo"><div class="rtitle">${JP.escape(w.title)}</div></div>
        <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap;justify-content:flex-end">
          ${statusBadge(w.status)}
          <span class="text-muted" style="font-size:12px;white-space:nowrap">${JP.escape(w.date)}</span>
        </div>
      </div>`).join('');
  }

  redrawRecentContent();
  redrawCourseWorkshopLists();

  /* ---------------------------------------------------------
     Add New Content modal
     --------------------------------------------------------- */
  const modal = document.getElementById('addContentModal');
  const form = document.getElementById('addContentForm');

  /* content-type single-select cards */
  const typeCards = document.querySelectorAll('.content-type-card');
  function selectType(type) {
    typeCards.forEach(card => {
      const on = card.dataset.type === type;
      card.classList.toggle('checked', on);
      card.querySelector('input').checked = on;
    });
  }
  typeCards.forEach(card => card.addEventListener('click', () => selectType(card.dataset.type)));

  /* quick-add dropdown from the split button caret */
  document.querySelectorAll('[data-quick-add]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      selectType(link.dataset.quickAdd);
      document.querySelectorAll('.dropdown-panel.open').forEach(p => p.classList.remove('open'));
      modal.classList.add('open');
    });
  });

  /* pricing radio -> toggle price field */
  const priceField = document.getElementById('priceField');
  const priceInput = document.getElementById('contentPrice');
  document.querySelectorAll('input[name="pricing"]').forEach(radio => {
    radio.addEventListener('change', () => {
      const isPaid = document.querySelector('input[name="pricing"]:checked').value === 'paid';
      priceField.classList.toggle('active', isPaid);
      priceInput.disabled = !isPaid;
      if (!isPaid) priceInput.value = '';
    });
  });

  /* file upload: click / drag&drop / preview */
  const drop = document.getElementById('contentDrop');
  const fileInput = document.getElementById('contentFileInput');
  const ALLOWED_EXT = ['pdf', 'doc', 'docx', 'ppt', 'pptx'];

  function showFile(file) {
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    const errEl = document.getElementById('contentFileError');
    errEl.closest('.form-group').classList.remove('has-error');
    if (!ALLOWED_EXT.includes(ext)) {
      errEl.closest('.form-group').classList.add('has-error');
      errEl.textContent = 'Only PDF, DOC, DOCX, PPT or PPTX files are allowed.';
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      errEl.closest('.form-group').classList.add('has-error');
      errEl.textContent = 'File must be 50MB or smaller.';
      return;
    }
    drop.querySelector('.drop-default').style.display = 'none';
    let holder = drop.querySelector('.drop-preview');
    if (!holder) {
      holder = document.createElement('div');
      holder.className = 'drop-preview';
      drop.insertBefore(holder, fileInput);
    }
    const kb = (file.size / 1024).toFixed(1);
    holder.innerHTML = `<i class="fa-solid fa-file-circle-check" style="font-size:20px;color:#1f6b4f;display:block;margin-bottom:6px"></i>
                        <div class="file-name">${JP.escape(file.name)}</div>
                        <div class="text-muted" style="font-size:11.5px">${kb} KB</div>`;
  }
  fileInput.addEventListener('change', () => showFile(fileInput.files[0]));
  ['dragenter', 'dragover'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add('dragover'); }));
  ['dragleave', 'drop'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove('dragover'); }));
  drop.addEventListener('drop', e => {
    const file = e.dataTransfer.files[0];
    if (file) { fileInput.files = e.dataTransfer.files; showFile(file); }
  });

  function resetContentForm() {
    form.reset();
    selectType('course');
    priceField.classList.remove('active');
    priceInput.disabled = true;
    form.querySelectorAll('.form-group.has-error').forEach(g => g.classList.remove('has-error'));
    const preview = drop.querySelector('.drop-preview');
    if (preview) { preview.remove(); drop.querySelector('.drop-default').style.display = ''; }
    fileInput.value = '';
  }

  /* submit / validation */
  form.addEventListener('submit', e => {
    e.preventDefault();

    const type = document.querySelector('input[name="contentType"]:checked').value;
    const title = document.getElementById('contentTitle').value.trim();
    const desc = document.getElementById('contentDesc').value.trim();
    const hasFile = fileInput.files.length > 0;
    const pricing = document.querySelector('input[name="pricing"]:checked').value;
    const price = priceInput.value.trim();
    const visibility = document.querySelector('input[name="visibility"]:checked').value;

    form.querySelectorAll('.form-group.has-error').forEach(g => g.classList.remove('has-error'));
    let ok = true;
    const flag = (id, message) => {
      const group = document.getElementById(id).closest('.form-group');
      group.classList.add('has-error');
      group.querySelector('.field-error').textContent = message;
      ok = false;
    };

    if (!title) flag('contentTitle', 'Title is required.');
    if (!desc) flag('contentDesc', 'Description is required.');
    if (!hasFile) {
      document.getElementById('contentFileError').closest('.form-group').classList.add('has-error');
      document.getElementById('contentFileError').textContent = 'Please upload a file.';
      ok = false;
    }
    if (pricing === 'paid' && (!price || isNaN(price) || Number(price) <= 0)) flag('contentPrice', 'Enter a valid price.');

    if (!ok) return;

    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    const statusLabel = visibility === 'published' ? 'Published' : 'Draft';

    /* update in-memory dashboard state */
    state.stats[type] += 1;
    state.recentContent.unshift({ type, title, date: today });
    if (type === 'course') state.recentCourses.unshift({ title, status: statusLabel, date: today });
    if (type === 'workshop') state.recentWorkshops.unshift({ title, status: statusLabel, date: today });

    redrawStats();
    redrawBreakdown();
    redrawRecentContent();
    redrawCourseWorkshopLists();

    /* hand a new quiz off to the Quizzes screen */
    if (type === 'quiz') {
      const file = fileInput.files[0];
      localStorage.setItem('jp_pending_quiz', JSON.stringify({
        title, course: 'General', file: file ? file.name : 'quiz-file.docx',
        size: file ? (file.size / 1024).toFixed(1) + ' KB' : '—',
        date: today, status: statusLabel
      }));
    }

    modal.classList.remove('open');
    resetContentForm();
    JP.toast(`"${title}" ${statusLabel === 'Published' ? 'published' : 'saved as draft'} successfully.`);
  });

  modal.querySelectorAll('[data-modal-close]').forEach(btn => btn.addEventListener('click', resetContentForm));

  /* deep link, e.g. uploader-dashboard.html?add=1&type=quiz */
  const params = new URLSearchParams(location.search);
  if (params.get('add') === '1') {
    if (TYPE_META[params.get('type')]) selectType(params.get('type'));
    modal.classList.add('open');
  }
});
