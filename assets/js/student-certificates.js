/* =========================================================
   Student — Certificates & CEUs
   Search, year filter, pagination, preview modal, download
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  const tbody = document.getElementById('certificatesBody');
  if (!tbody) return;

  const certificates = STUDENT.certificates;
  const PER_PAGE = 8;
  let currentPage = 1;

  const searchInput = document.getElementById('certSearch');
  const yearFilter = document.getElementById('yearFilter');
  const showingLabel = document.getElementById('certShowing');
  const pager = document.getElementById('certPagination');

  const years = [...new Set(certificates.map(c => c.completedOn.split(', ')[1]))].sort().reverse();
  yearFilter.innerHTML = '<option value="all">All Years</option>' + years.map(y => `<option value="${y}">${y}</option>`).join('');

  function filtered() {
    const q = (searchInput.value || '').trim().toLowerCase();
    return certificates.filter(c =>
      (!q || c.course.toLowerCase().includes(q)) &&
      (yearFilter.value === 'all' || c.completedOn.endsWith(yearFilter.value))
    );
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
          <i class="fa-regular fa-file-lines"></i>
          <div>No certificates match your search.</div>
        </div></td></tr>`;
    } else {
      tbody.innerHTML = pageRows.map(c => {
        const idx = certificates.indexOf(c);
        return `
        <tr>
          <td>
            <div class="cell-course">
              ${STUDENT.thumb(c.course, 'sm')}
              <div>
                <div class="cc-title">${JP.escape(c.course)}</div>
                <div class="cc-sub">Certificate of Completion</div>
              </div>
            </div>
          </td>
          <td class="text-muted">${JP.escape(c.completedOn)}</td>
          <td><span class="badge-status green">${c.ceus.toFixed(1)} CEUs</span></td>
          <td class="text-muted">${JP.escape(c.id)}</td>
          <td class="td-actions">
            <div class="row-actions">
              <button class="btn btn-outline btn-sm btn-cert-action" data-view="${idx}"><i class="fa-regular fa-eye"></i> View</button>
              <button class="btn btn-outline btn-sm btn-cert-action" data-download="${idx}"><i class="fa-solid fa-download"></i> Download</button>
              <div class="action-menu">
                <button class="action-dots" data-row-menu="${idx}" title="More"><i class="fa-solid fa-ellipsis-vertical"></i></button>
                <div class="action-dropdown" id="certMenu-${idx}">
                  <button data-share="${JP.escape(c.course)}"><i class="fa-solid fa-share-nodes"></i> Share Certificate</button>
                  <button data-print="${JP.escape(c.course)}"><i class="fa-solid fa-print"></i> Print</button>
                </div>
              </div>
            </div>
          </td>
        </tr>`;
      }).join('');
    }

    const from = rows.length ? start + 1 : 0;
    const to = Math.min(start + PER_PAGE, rows.length);
    showingLabel.textContent = `Showing ${from} to ${to} of ${rows.length} certificates`;

    pager.style.display = totalPages <= 1 ? 'none' : '';
    JP.renderPagination(pager, currentPage, totalPages, page => { currentPage = page; render(); });

    wireRowActions();
  }

  function wireRowActions() {
    tbody.querySelectorAll('[data-view]').forEach(b => b.addEventListener('click', () => openPreview(certificates[Number(b.dataset.view)])));
    tbody.querySelectorAll('[data-download]').forEach(b => b.addEventListener('click', () => downloadCertificate(certificates[Number(b.dataset.download)])));

    tbody.querySelectorAll('[data-row-menu]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const menu = document.getElementById('certMenu-' + btn.dataset.rowMenu);
        const wasOpen = menu.classList.contains('open');
        document.querySelectorAll('.action-dropdown.open').forEach(m => m.classList.remove('open'));
        if (!wasOpen) menu.classList.add('open');
      });
    });
    tbody.querySelectorAll('[data-share]').forEach(btn =>
      btn.addEventListener('click', () => { document.querySelectorAll('.action-dropdown.open').forEach(m => m.classList.remove('open')); JP.comingSoon(`${btn.dataset.share} — Share`, 'page'); }));
    tbody.querySelectorAll('[data-print]').forEach(btn =>
      btn.addEventListener('click', () => { document.querySelectorAll('.action-dropdown.open').forEach(m => m.classList.remove('open')); JP.comingSoon(`${btn.dataset.print} — Print`, 'page'); }));
  }

  const modal = document.getElementById('certModal');
  const body = document.getElementById('certModalBody');
  let active = null;

  function openPreview(c) {
    active = c;
    body.innerHTML = `
      <div class="cert-preview">
        <div class="cert-logo">&#936;</div>
        <div class="cert-org">JamPsych Society &middot; Learning Management System</div>
        <h3>Certificate of Completion</h3>
        <div style="font-size:12.5px;color:#6b7280;margin-bottom:14px">This certifies that</div>
        <div class="cert-name">Emily Davis</div>
        <div style="font-size:12.5px;color:#6b7280;margin-bottom:6px">has successfully completed</div>
        <div class="cert-course"><b>${JP.escape(c.course)}</b></div>
        <div class="cert-meta">
          <div>Completed On<b>${JP.escape(c.completedOn)}</b></div>
          <div>CEUs Earned<b>${c.ceus.toFixed(1)}</b></div>
          <div>Certificate ID<b>${JP.escape(c.id)}</b></div>
        </div>
      </div>`;
    modal.classList.add('open');
  }

  function downloadCertificate(c) {
    const html = `<!doctype html><html><head><meta charset="utf-8">
<title>Emily Davis — ${JP.escape(c.course)}</title>
<style>
  body{font-family:Georgia,serif;background:#f5f6f8;padding:40px;display:flex;justify-content:center}
  .cert{background:#fdfdf9;border:10px solid #1f6b4f;border-radius:14px;max-width:760px;width:100%;
        padding:60px 50px;text-align:center;box-shadow:0 10px 40px rgba(0,0,0,.12)}
  .logo{width:70px;height:70px;border-radius:50%;background:#f0b429;color:#123a30;font-size:34px;
        display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-weight:bold}
  .org{letter-spacing:.14em;text-transform:uppercase;font-size:12px;color:#1f6b4f;font-family:Arial,sans-serif}
  h1{font-size:26px;margin:26px 0 6px;color:#111827}
  .name{font-size:38px;margin:16px 0;color:#111827}
  .course{font-size:20px;color:#1f2937;margin-bottom:26px}
  .meta{display:flex;justify-content:center;gap:60px;margin-top:36px;font-family:Arial,sans-serif;font-size:12px;color:#6b7280}
  .meta b{display:block;color:#111827;font-size:14px;margin-top:4px}
  .small{font-size:13px;color:#6b7280;font-family:Arial,sans-serif}
</style></head><body>
  <div class="cert">
    <div class="logo">&#936;</div>
    <div class="org">JamPsych Society</div>
    <h1>Certificate of Completion</h1>
    <div class="small">This certifies that</div>
    <div class="name">Emily Davis</div>
    <div class="small">has successfully completed</div>
    <div class="course">${JP.escape(c.course)}</div>
    <div class="meta">
      <div>Completed On<b>${JP.escape(c.completedOn)}</b></div>
      <div>CEUs Earned<b>${c.ceus.toFixed(1)}</b></div>
      <div>Certificate ID<b>${JP.escape(c.id)}</b></div>
    </div>
  </div>
</body></html>`;
    JP.download(`certificate-${c.id}.html`, html, 'text/html;charset=utf-8');
    JP.toast(`Certificate for "${c.course}" downloaded.`);
  }

  document.getElementById('certModalDownload').addEventListener('click', () => active && downloadCertificate(active));

  let debounce;
  searchInput.addEventListener('input', () => { clearTimeout(debounce); debounce = setTimeout(() => { currentPage = 1; render(); }, 180); });
  yearFilter.addEventListener('change', () => { currentPage = 1; render(); });

  render();
});
