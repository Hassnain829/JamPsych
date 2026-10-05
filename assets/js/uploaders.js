/* =========================================================
   Uploaders screen — searchable / filterable / paginated table
   plus the "Add Uploader" modal form
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- demo data (18 uploaders, as per the design) ---------- */
  let uploaders = [
    { name: 'Kerri-Ann Peart', email: 'k.peart@jampsych.com',   courses: 18, workshops: 5, quizzes: 12, status: 'Active',   date: 'May 10, 2024' },
    { name: 'David Wilson',    email: 'd.wilson@jampsych.com',  courses: 12, workshops: 3, quizzes: 8,  status: 'Active',   date: 'Apr 22, 2024' },
    { name: 'Sarah Brown',     email: 's.brown@jampsych.com',   courses: 9,  workshops: 2, quizzes: 6,  status: 'Active',   date: 'Apr 15, 2024' },
    { name: 'Michael Lee',     email: 'm.lee@jampsych.com',     courses: 7,  workshops: 4, quizzes: 5,  status: 'Inactive', date: 'Mar 30, 2024' },
    { name: 'Emily Davis',     email: 'e.davis@jampsych.com',   courses: 10, workshops: 2, quizzes: 7,  status: 'Active',   date: 'Mar 18, 2024' },
    { name: 'Robert Johnson',  email: 'r.johnson@jampsych.com', courses: 6,  workshops: 1, quizzes: 4,  status: 'Active',   date: 'Feb 28, 2024' },
    { name: 'Lori Clarke',     email: 'l.clarke@jampsych.com',  courses: 5,  workshops: 1, quizzes: 3,  status: 'Inactive', date: 'Feb 10, 2024' },
    { name: 'Paul White',      email: 'p.white@jampsych.com',   courses: 3,  workshops: 1, quizzes: 2,  status: 'Active',   date: 'Jan 25, 2024' },
    { name: 'Andrea Grant',    email: 'a.grant@jampsych.com',   courses: 14, workshops: 6, quizzes: 9,  status: 'Active',   date: 'Jan 18, 2024' },
    { name: 'Marcus Bennett',  email: 'm.bennett@jampsych.com', courses: 8,  workshops: 2, quizzes: 5,  status: 'Active',   date: 'Jan 09, 2024' },
    { name: 'Nadine Fowler',   email: 'n.fowler@jampsych.com',  courses: 4,  workshops: 3, quizzes: 4,  status: 'Inactive', date: 'Dec 20, 2023' },
    { name: 'Trevor Campbell', email: 't.campbell@jampsych.com',courses: 11, workshops: 4, quizzes: 7,  status: 'Active',   date: 'Dec 02, 2023' },
    { name: 'Simone Reid',     email: 's.reid@jampsych.com',    courses: 6,  workshops: 2, quizzes: 3,  status: 'Active',   date: 'Nov 24, 2023' },
    { name: 'Damion Bryan',    email: 'd.bryan@jampsych.com',   courses: 2,  workshops: 1, quizzes: 1,  status: 'Inactive', date: 'Nov 11, 2023' },
    { name: 'Alicia Morgan',   email: 'a.morgan@jampsych.com',  courses: 15, workshops: 5, quizzes: 10, status: 'Active',   date: 'Oct 30, 2023' },
    { name: 'Karl Henriques',  email: 'k.henriques@jampsych.com',courses: 7, workshops: 2, quizzes: 6,  status: 'Active',   date: 'Oct 12, 2023' },
    { name: 'Rochelle Palmer', email: 'r.palmer@jampsych.com',  courses: 9,  workshops: 3, quizzes: 5,  status: 'Active',   date: 'Sep 28, 2023' },
    { name: 'Devon Miller',    email: 'd.miller@jampsych.com',  courses: 5,  workshops: 1, quizzes: 2,  status: 'Inactive', date: 'Sep 05, 2023' }
  ];

  const PER_PAGE = 8;
  let currentPage = 1;

  const tbody = document.getElementById('uploadersBody');
  const searchInput = document.getElementById('uploaderSearch');
  const statusFilter = document.getElementById('statusFilter');
  const showingLabel = document.getElementById('showingLabel');
  const pager = document.getElementById('pagination');
  if (!tbody) return;

  /* ---------- filtering ---------- */
  function filtered() {
    const q = (searchInput.value || '').trim().toLowerCase();
    const status = statusFilter.value;
    return uploaders.filter(u => {
      const matchesQuery = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      const matchesStatus = status === 'all' || u.status.toLowerCase() === status;
      return matchesQuery && matchesStatus;
    });
  }

  /* ---------- rendering ---------- */
  function render() {
    const rows = filtered();
    const totalPages = Math.max(1, Math.ceil(rows.length / PER_PAGE));
    if (currentPage > totalPages) currentPage = totalPages;

    const start = (currentPage - 1) * PER_PAGE;
    const pageRows = rows.slice(start, start + PER_PAGE);

    if (!pageRows.length) {
      tbody.innerHTML = `<tr><td colspan="6">
          <div class="empty-state">
            <i class="fa-regular fa-folder-open"></i>
            <div>No uploaders match your filters.</div>
          </div></td></tr>`;
    } else {
      tbody.innerHTML = pageRows.map((u, i) => {
        const idx = uploaders.indexOf(u);
        const quizWord = u.quizzes === 1 ? 'Quiz' : 'Quizzes';
        const workshopWord = u.workshops === 1 ? 'Workshop' : 'Workshops';
        const courseWord = u.courses === 1 ? 'Course' : 'Courses';
        return `
        <tr>
          <td>
            <div class="cell-person">
              ${JP.avatar(u.name)}
              <div><div class="pname">${JP.escape(u.name)}</div></div>
            </div>
          </td>
          <td class="text-muted">${JP.escape(u.email)}</td>
          <td class="text-muted">${u.courses} ${courseWord}, ${u.workshops} ${workshopWord}, ${u.quizzes} ${quizWord}</td>
          <td><span class="badge-status ${u.status === 'Active' ? 'green' : 'red'}">${u.status}</span></td>
          <td class="text-muted">${JP.escape(u.date)}</td>
          <td>
            <div class="action-menu">
              <button class="action-dots" data-row-menu="${idx}" title="Actions"><i class="fa-solid fa-ellipsis-vertical"></i></button>
              <div class="action-dropdown" id="rowMenu-${idx}">
                <button data-act="view" data-idx="${idx}"><i class="fa-regular fa-eye"></i> View profile</button>
                <button data-act="edit" data-idx="${idx}"><i class="fa-regular fa-pen-to-square"></i> Edit</button>
                <button data-act="toggle" data-idx="${idx}"><i class="fa-solid fa-power-off"></i> ${u.status === 'Active' ? 'Deactivate' : 'Activate'}</button>
                <button data-act="delete" data-idx="${idx}" class="danger"><i class="fa-regular fa-trash-can"></i> Delete</button>
              </div>
            </div>
          </td>
        </tr>`;
      }).join('');
    }

    const from = rows.length ? start + 1 : 0;
    const to = Math.min(start + PER_PAGE, rows.length);
    showingLabel.textContent = `Showing ${from} to ${to} of ${rows.length} uploaders`;

    JP.renderPagination(pager, currentPage, totalPages, page => {
      currentPage = page;
      render();
      document.querySelector('.page-content').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    wireRowMenus();
  }

  /* ---------- row action menus ---------- */
  function wireRowMenus() {
    tbody.querySelectorAll('[data-row-menu]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const menu = document.getElementById('rowMenu-' + btn.dataset.rowMenu);
        const wasOpen = menu.classList.contains('open');
        document.querySelectorAll('.action-dropdown.open').forEach(m => m.classList.remove('open'));
        if (!wasOpen) menu.classList.add('open');
      });
    });

    tbody.querySelectorAll('[data-act]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const idx = Number(btn.dataset.idx);
        const u = uploaders[idx];
        document.querySelectorAll('.action-dropdown.open').forEach(m => m.classList.remove('open'));

        switch (btn.dataset.act) {
          case 'view':
            JP.toast(`${u.name} — ${u.courses} courses, ${u.workshops} workshops, ${u.quizzes} quizzes.`);
            break;
          case 'edit':
            JP.toast(`Editing is disabled in this static build (${u.name}).`);
            break;
          case 'toggle':
            u.status = u.status === 'Active' ? 'Inactive' : 'Active';
            JP.toast(`${u.name} is now ${u.status.toLowerCase()}.`);
            render();
            break;
          case 'delete':
            if (confirm(`Delete uploader "${u.name}"? This cannot be undone.`)) {
              uploaders.splice(idx, 1);
              JP.toast('Uploader deleted.');
              render();
            }
            break;
        }
      });
    });
  }

  /* ---------- filters ---------- */
  let debounce;
  searchInput.addEventListener('input', () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => { currentPage = 1; render(); }, 180);
  });
  statusFilter.addEventListener('change', () => { currentPage = 1; render(); });

  /* ---------- export ---------- */
  const exportBtn = document.getElementById('exportBtn');
  exportBtn && exportBtn.addEventListener('click', () => {
    const rows = filtered().map(u => [u.name, u.email, u.courses, u.workshops, u.quizzes, u.status, u.date]);
    if (!rows.length) return JP.toast('Nothing to export for the current filters.', 'error');
    JP.exportCsv('jampsych-uploaders.csv',
      ['Name', 'Email', 'Courses', 'Workshops', 'Quizzes', 'Status', 'Date Added'], rows);
    JP.toast(`Exported ${rows.length} uploader${rows.length === 1 ? '' : 's'} to CSV.`);
  });

  /* =======================================================
     Add Uploader modal
     ======================================================= */
  const modal = document.getElementById('addUploaderModal');
  const form = document.getElementById('addUploaderForm');

  /* password visibility toggles */
  document.querySelectorAll('.password-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.parentElement.querySelector('input');
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      btn.innerHTML = `<i class="fa-regular ${show ? 'fa-eye-slash' : 'fa-eye'}"></i>`;
    });
  });

  /* permission cards (the <label> handles the toggle natively) */
  function resetPermCards() {
    document.querySelectorAll('.perm-card').forEach(card => {
      const input = card.querySelector('input');
      input.checked = false;
      card.classList.remove('checked');
    });
  }

  document.querySelectorAll('.perm-card').forEach(card => {
    const input = card.querySelector('input');
    const sync = () => card.classList.toggle('checked', input.checked);
    input.addEventListener('change', sync);
    sync();
  });

  /* profile picture: click, drag & drop, preview */
  const drop = document.getElementById('avatarDrop');
  const fileInput = document.getElementById('avatarInput');

  function clearErrors() {
    form.querySelectorAll('.form-group.has-error').forEach(g => g.classList.remove('has-error'));
  }

  function resetAddUploaderForm() {
    form.reset();
    clearErrors();
    resetPermCards();
    const preview = drop && drop.querySelector('.drop-preview');
    if (preview) { preview.remove(); drop.querySelector('.drop-default').style.display = ''; }
  }

  document.querySelectorAll('[data-modal-open="addUploaderModal"]').forEach(btn => {
    btn.addEventListener('click', resetAddUploaderForm);
  });

  /* deep link from the dashboard: uploaders.html?add=1 opens the modal */
  if (new URLSearchParams(location.search).get('add') === '1') {
    resetAddUploaderForm();
    document.getElementById('addUploaderModal').classList.add('open');
  }

  if (drop && fileInput) {
    const showFile = file => {
      if (!file) return;
      if (!/^image\/(png|jpe?g)$/i.test(file.type)) return JP.toast('Only PNG, JPG or JPEG files are allowed.', 'error');
      if (file.size > 2 * 1024 * 1024) return JP.toast('Image must be 2MB or smaller.', 'error');
      const reader = new FileReader();
      reader.onload = ev => {
        drop.querySelector('.drop-default').style.display = 'none';
        let holder = drop.querySelector('.drop-preview');
        if (!holder) {
          holder = document.createElement('div');
          holder.className = 'drop-preview';
          drop.insertBefore(holder, fileInput);
        }
        holder.innerHTML = `<img src="${ev.target.result}" class="preview-thumb" alt="Profile preview">
                            <div class="file-name">${JP.escape(file.name)}</div>`;
      };
      reader.readAsDataURL(file);
    };

    fileInput.addEventListener('change', () => showFile(fileInput.files[0]));
    ['dragenter', 'dragover'].forEach(ev =>
      drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add('dragover'); }));
    ['dragleave', 'drop'].forEach(ev =>
      drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove('dragover'); }));
    drop.addEventListener('drop', e => {
      const file = e.dataTransfer.files[0];
      if (file) { fileInput.files = e.dataTransfer.files; showFile(file); }
    });
  }

  /* validation + submit */
  function setError(id, message) {
    const group = document.getElementById(id).closest('.form-group');
    group.classList.add('has-error');
    group.querySelector('.field-error').textContent = message;
  }

  form && form.addEventListener('submit', e => {
    e.preventDefault();
    clearErrors();

    const name = document.getElementById('fullName').value.trim();
    const email = document.getElementById('emailAddress').value.trim();
    const phone = document.getElementById('phoneNumber').value.trim();
    const pass = document.getElementById('password').value;
    const confirmPass = document.getElementById('confirmPassword').value;
    const status = document.getElementById('accountStatus').value;

    let ok = true;
    if (!name) { setError('fullName', 'Full name is required.'); ok = false; }
    if (!email) { setError('emailAddress', 'Email address is required.'); ok = false; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { setError('emailAddress', 'Enter a valid email address.'); ok = false; }
    else if (uploaders.some(u => u.email.toLowerCase() === email.toLowerCase())) { setError('emailAddress', 'An uploader with this email already exists.'); ok = false; }
    if (phone && !/^[\d\s()+-]{7,}$/.test(phone)) { setError('phoneNumber', 'Enter a valid phone number.'); ok = false; }
    if (!pass) { setError('password', 'Password is required.'); ok = false; }
    else if (pass.length < 8) { setError('password', 'Password must be at least 8 characters.'); ok = false; }
    if (!confirmPass) { setError('confirmPassword', 'Please confirm the password.'); ok = false; }
    else if (pass !== confirmPass) { setError('confirmPassword', 'Passwords do not match.'); ok = false; }

    const perms = [...form.querySelectorAll('.perm-card input:checked')].map(i => i.value);
    if (!perms.length) { JP.toast('Select at least one permission.', 'error'); ok = false; }

    if (!ok) return;

    uploaders.unshift({
      name, email, courses: 0, workshops: 0, quizzes: 0,
      status: status === 'active' ? 'Active' : 'Inactive',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      permissions: perms
    });

    form.reset();
    clearErrors();
    resetPermCards();
    const preview = drop && drop.querySelector('.drop-preview');
    if (preview) { preview.remove(); drop.querySelector('.drop-default').style.display = ''; }

    modal.classList.remove('open');
    currentPage = 1;
    searchInput.value = '';
    statusFilter.value = 'all';
    render();
    JP.toast(`Uploader "${name}" created successfully.`);
  });

  render();
});
