/* =========================================================
   Certificates & CEUs screen — multi-filter table,
   certificate preview modal and certificate download
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  const LOGO_SRC = 'assets/images/jampsych-logo.png';

  const certificates = [
    { student: 'Emily Davis',     email: 'emily.davis@email.com',     course: 'The Science of Self-Compassion',  type: 'Certificate of Completion', issued: 'May 20, 2024', by: 'Kerri-Ann Peart', status: 'Issued' },
    { student: 'David Wilson',    email: 'david.wilson@email.com',    course: 'Developing a Growth Mindset',     type: 'Certificate of Completion', issued: 'May 18, 2024', by: 'Sarah Brown',     status: 'Issued' },
    { student: 'Michael Lee',     email: 'michael.lee@email.com',     course: 'Crisis Management in Schools',    type: 'CEU Certificate',           issued: 'May 15, 2024', by: 'Michael Lee',     status: 'Issued' },
    { student: 'Sarah Johnson',   email: 'sarah.johnson@email.com',   course: 'Overcoming Procrastination',      type: 'Certificate of Completion', issued: 'May 12, 2024', by: 'Emily Davis',     status: 'Issued' },
    { student: 'Robert Anderson', email: 'robert.anderson@email.com', course: 'The Power of Gratitude',          type: 'CEU Certificate',           issued: 'May 10, 2024', by: 'David Wilson',    status: 'Issued' },
    { student: 'Jessica Clark',   email: 'jessica.clark@email.com',   course: 'Building Resilience for Students',type: 'Certificate of Completion', issued: 'May 08, 2024', by: 'Kerri-Ann Peart', status: 'Issued' },
    { student: 'Daniel Martinez', email: 'daniel.martinez@email.com', course: 'Positive Parenting Strategies',   type: 'CEU Certificate',           issued: 'May 05, 2024', by: 'Sarah Brown',     status: 'Issued' },
    { student: 'Amanda White',    email: 'amanda.white@email.com',    course: 'Mindfulness for Educators',       type: 'Certificate of Completion', issued: 'May 02, 2024', by: 'Emily Davis',     status: 'Issued' },
    { student: 'Christopher Bell',email: 'chris.bell@email.com',      course: 'The Science of Self-Compassion',  type: 'CEU Certificate',           issued: 'Apr 28, 2024', by: 'Kerri-Ann Peart', status: 'Issued' },
    { student: 'Natalie Foster',  email: 'natalie.foster@email.com',  course: 'Developing a Growth Mindset',     type: 'Certificate of Completion', issued: 'Apr 25, 2024', by: 'David Wilson',    status: 'Issued' },
    { student: 'Kevin Brooks',    email: 'kevin.brooks@email.com',    course: 'Crisis Management in Schools',    type: 'CEU Certificate',           issued: 'Apr 22, 2024', by: 'Michael Lee',     status: 'Pending' },
    { student: 'Olivia Bennett',  email: 'olivia.bennett@email.com',  course: 'Mindfulness for Educators',       type: 'Certificate of Completion', issued: 'Apr 19, 2024', by: 'Sarah Brown',     status: 'Issued' },
    { student: 'Marcus Reid',     email: 'marcus.reid@email.com',     course: 'Overcoming Procrastination',      type: 'CEU Certificate',           issued: 'Apr 16, 2024', by: 'Emily Davis',     status: 'Issued' },
    { student: 'Hannah Powell',   email: 'hannah.powell@email.com',   course: 'Positive Parenting Strategies',   type: 'Certificate of Completion', issued: 'Apr 12, 2024', by: 'Kerri-Ann Peart', status: 'Issued' },
    { student: 'Andre Campbell',  email: 'andre.campbell@email.com',  course: 'The Power of Gratitude',          type: 'Certificate of Completion', issued: 'Apr 09, 2024', by: 'David Wilson',    status: 'Revoked' },
    { student: 'Grace Thompson',  email: 'grace.thompson@email.com',  course: 'Building Resilience for Students',type: 'CEU Certificate',           issued: 'Apr 05, 2024', by: 'Michael Lee',     status: 'Issued' },
    { student: 'Peter Nolan',     email: 'peter.nolan@email.com',     course: 'The Science of Self-Compassion',  type: 'Certificate of Completion', issued: 'Apr 02, 2024', by: 'Sarah Brown',     status: 'Issued' },
    { student: 'Rachel Gordon',   email: 'rachel.gordon@email.com',   course: 'Mindfulness for Educators',       type: 'CEU Certificate',           issued: 'Mar 29, 2024', by: 'Emily Davis',     status: 'Issued' },
    { student: 'Tyrone Walters',  email: 'tyrone.walters@email.com',  course: 'Developing a Growth Mindset',     type: 'Certificate of Completion', issued: 'Mar 26, 2024', by: 'Kerri-Ann Peart', status: 'Pending' },
    { student: 'Melissa Cole',    email: 'melissa.cole@email.com',    course: 'Crisis Management in Schools',    type: 'Certificate of Completion', issued: 'Mar 22, 2024', by: 'David Wilson',    status: 'Issued' },
    { student: 'Jason Fleming',   email: 'jason.fleming@email.com',   course: 'Overcoming Procrastination',      type: 'CEU Certificate',           issued: 'Mar 18, 2024', by: 'Michael Lee',     status: 'Issued' },
    { student: 'Chloe Barrett',   email: 'chloe.barrett@email.com',   course: 'Positive Parenting Strategies',   type: 'Certificate of Completion', issued: 'Mar 15, 2024', by: 'Sarah Brown',     status: 'Issued' },
    { student: 'Ian Mitchell',    email: 'ian.mitchell@email.com',    course: 'The Power of Gratitude',          type: 'CEU Certificate',           issued: 'Mar 11, 2024', by: 'Emily Davis',     status: 'Issued' },
    { student: 'Sophia Ellis',    email: 'sophia.ellis@email.com',    course: 'Building Resilience for Students',type: 'Certificate of Completion', issued: 'Mar 07, 2024', by: 'Kerri-Ann Peart', status: 'Issued' }
  ];

  const PER_PAGE = 8;
  let currentPage = 1;

  const tbody = document.getElementById('certificatesBody');
  const searchInput = document.getElementById('certSearch');
  const uploaderFilter = document.getElementById('uploaderFilter');
  const courseFilter = document.getElementById('courseFilter');
  const typeFilter = document.getElementById('typeFilter');
  const resetBtn = document.getElementById('resetFilters');
  const showingLabel = document.getElementById('certShowing');
  const pager = document.getElementById('certPagination');
  if (!tbody) return;

  /* ---------- populate the filter dropdowns from the data ---------- */
  const fill = (select, values) => {
    values.forEach(v => {
      const opt = document.createElement('option');
      opt.value = v;
      opt.textContent = v;
      select.appendChild(opt);
    });
  };
  fill(uploaderFilter, [...new Set(certificates.map(c => c.by))].sort());
  fill(courseFilter, [...new Set(certificates.map(c => c.course))].sort());
  fill(typeFilter, [...new Set(certificates.map(c => c.type))].sort());

  /* ---------- filtering ---------- */
  function filtered() {
    const q = (searchInput.value || '').trim().toLowerCase();
    return certificates.filter(c =>
      (!q || c.student.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)) &&
      (uploaderFilter.value === 'all' || c.by === uploaderFilter.value) &&
      (courseFilter.value === 'all' || c.course === courseFilter.value) &&
      (typeFilter.value === 'all' || c.type === typeFilter.value)
    );
  }

  const statusClass = s => (s === 'Issued' ? 'green' : s === 'Pending' ? 'orange' : 'red');

  /* ---------- rendering ---------- */
  function render() {
    const rows = filtered();
    const totalPages = Math.max(1, Math.ceil(rows.length / PER_PAGE));
    if (currentPage > totalPages) currentPage = totalPages;

    const start = (currentPage - 1) * PER_PAGE;
    const pageRows = rows.slice(start, start + PER_PAGE);

    if (!pageRows.length) {
      tbody.innerHTML = `<tr><td colspan="7">
        <div class="empty-state">
          <i class="fa-regular fa-file-lines"></i>
          <div>No certificates match your filters.</div>
        </div></td></tr>`;
    } else {
      tbody.innerHTML = pageRows.map(c => {
        const idx = certificates.indexOf(c);
        return `
        <tr>
          <td>
            <div class="cell-person">
              ${JP.avatar(c.student)}
              <div>
                <div class="pname">${JP.escape(c.student)}</div>
                <div class="psub">${JP.escape(c.email)}</div>
              </div>
            </div>
          </td>
          <td>${JP.escape(c.course)}</td>
          <td class="text-muted">${JP.escape(c.type)}</td>
          <td class="text-muted">${JP.escape(c.issued)}</td>
          <td class="text-muted">${JP.escape(c.by)}</td>
          <td><span class="badge-status ${statusClass(c.status)}">${c.status}</span></td>
          <td style="white-space:nowrap">
            <button class="icon-action" data-view="${idx}" title="View certificate"><i class="fa-regular fa-eye"></i></button>
            <button class="icon-action" data-download="${idx}" title="Download certificate"><i class="fa-solid fa-download"></i></button>
          </td>
        </tr>`;
      }).join('');
    }

    const from = rows.length ? start + 1 : 0;
    const to = Math.min(start + PER_PAGE, rows.length);
    showingLabel.textContent = `Showing ${from} to ${to} of ${rows.length} certificates`;

    JP.renderPagination(pager, currentPage, totalPages, page => {
      currentPage = page;
      render();
    });

    tbody.querySelectorAll('[data-view]').forEach(b =>
      b.addEventListener('click', () => openPreview(certificates[Number(b.dataset.view)])));
    tbody.querySelectorAll('[data-download]').forEach(b =>
      b.addEventListener('click', () => downloadCertificate(certificates[Number(b.dataset.download)])));
  }

  /* ---------- preview modal ---------- */
  const modal = document.getElementById('certModal');
  const body = document.getElementById('certModalBody');
  let activeCert = null;

  function openPreview(c) {
    activeCert = c;
    body.innerHTML = `
      <div class="cert-preview">
        <div class="cert-logo"><img src="${LOGO_SRC}" alt="JamPsych Society"></div>
        <div class="cert-org">JamPsych Society &middot; Learning Management System</div>
        <h3>${c.type === 'CEU Certificate' ? 'CEU Certificate' : 'Certificate of Completion'}</h3>
        <div style="font-size:12.5px;color:#6b7280;margin-bottom:14px">This certifies that</div>
        <div class="cert-name">${JP.escape(c.student)}</div>
        <div style="font-size:12.5px;color:#6b7280;margin-bottom:6px">has successfully completed</div>
        <div class="cert-course"><b>${JP.escape(c.course)}</b></div>
        <div class="cert-meta">
          <div>Issued On<b>${JP.escape(c.issued)}</b></div>
          <div>Issued By<b>${JP.escape(c.by)}</b></div>
          <div>Status<b>${JP.escape(c.status)}</b></div>
        </div>
      </div>`;
    modal.classList.add('open');
  }

  /* ---------- certificate download (self-contained HTML file) ---------- */
  function downloadCertificate(c) {
    if (c.status !== 'Issued') {
      return JP.toast(`This certificate is ${c.status.toLowerCase()} and cannot be downloaded.`, 'error');
    }
    const html = `<!doctype html><html><head><meta charset="utf-8">
<title>${JP.escape(c.student)} — ${JP.escape(c.type)}</title>
<style>
  body{font-family:Georgia,serif;background:#f5f6f8;padding:40px;display:flex;justify-content:center}
  .cert{background:#fdfdf9;border:10px solid #1f6b4f;border-radius:14px;max-width:760px;width:100%;
        padding:60px 50px;text-align:center;box-shadow:0 10px 40px rgba(0,0,0,.12)}
  .logo{width:70px;height:70px;border-radius:50%;margin:0 auto 16px;overflow:hidden}
  .logo img{width:100%;height:100%;object-fit:cover;display:block}
  .org{letter-spacing:.14em;text-transform:uppercase;font-size:12px;color:#1f6b4f;font-family:Arial,sans-serif}
  h1{font-size:26px;margin:26px 0 6px;color:#111827}
  .name{font-size:38px;margin:16px 0;color:#111827}
  .course{font-size:20px;color:#1f2937;margin-bottom:26px}
  .meta{display:flex;justify-content:center;gap:60px;margin-top:36px;font-family:Arial,sans-serif;font-size:12px;color:#6b7280}
  .meta b{display:block;color:#111827;font-size:14px;margin-top:4px}
  .small{font-size:13px;color:#6b7280;font-family:Arial,sans-serif}
</style></head><body>
  <div class="cert">
    <div class="logo"><img src="${LOGO_SRC}" alt="JamPsych Society"></div>
    <div class="org">JamPsych Society</div>
    <h1>${JP.escape(c.type)}</h1>
    <div class="small">This certifies that</div>
    <div class="name">${JP.escape(c.student)}</div>
    <div class="small">has successfully completed</div>
    <div class="course">${JP.escape(c.course)}</div>
    <div class="meta">
      <div>Issued On<b>${JP.escape(c.issued)}</b></div>
      <div>Issued By<b>${JP.escape(c.by)}</b></div>
      <div>Certificate ID<b>JP-${String(certificates.indexOf(c) + 1001)}</b></div>
    </div>
  </div>
</body></html>`;
    const safe = c.student.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    JP.download(`certificate-${safe}.html`, html, 'text/html;charset=utf-8');
    JP.toast(`Certificate for ${c.student} downloaded.`);
  }

  const modalDownload = document.getElementById('certModalDownload');
  modalDownload && modalDownload.addEventListener('click', () => activeCert && downloadCertificate(activeCert));

  /* ---------- filter wiring ---------- */
  let debounce;
  searchInput.addEventListener('input', () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => { currentPage = 1; render(); }, 180);
  });
  [uploaderFilter, courseFilter, typeFilter].forEach(sel =>
    sel.addEventListener('change', () => { currentPage = 1; render(); }));

  resetBtn && resetBtn.addEventListener('click', () => {
    searchInput.value = '';
    uploaderFilter.value = 'all';
    courseFilter.value = 'all';
    typeFilter.value = 'all';
    currentPage = 1;
    render();
    JP.toast('Filters reset.');
  });

  render();
});
