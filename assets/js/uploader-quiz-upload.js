/* =========================================================
   Uploader — Upload New Quiz page
   Validates and hands the new quiz to the Quizzes list via
   localStorage, then redirects back.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('quizUploadForm');
  if (!form) return;

  const titleInput = document.getElementById('quizTitle');
  const courseSelect = document.getElementById('quizCourse');
  const descInput = document.getElementById('quizDesc');
  const descCount = document.getElementById('descCount');
  const drop = document.getElementById('quizDrop');
  const fileInput = document.getElementById('quizFileInput');
  const fileError = document.getElementById('quizFileError');

  /* live character counter */
  descInput.addEventListener('input', () => { descCount.textContent = descInput.value.length; });

  /* file upload: click / drag&drop / preview */
  function showFile(file) {
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    fileError.closest('.form-group').classList.remove('has-error');
    if (!['doc', 'docx'].includes(ext)) {
      fileError.closest('.form-group').classList.add('has-error');
      fileError.textContent = 'Only .doc or .docx files are allowed.';
      fileInput.value = '';
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      fileError.closest('.form-group').classList.add('has-error');
      fileError.textContent = 'File must be 50MB or smaller.';
      fileInput.value = '';
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
    holder.innerHTML = `<i class="fa-solid fa-file-word" style="font-size:22px;color:#3b82f6;display:block;margin-bottom:6px"></i>
                        <div class="file-name">${JP.escape(file.name)}</div>
                        <div class="text-muted" style="font-size:11.5px">${kb} KB &middot; click to replace</div>`;
  }
  fileInput.addEventListener('change', () => showFile(fileInput.files[0]));
  ['dragenter', 'dragover'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add('dragover'); }));
  ['dragleave', 'drop'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove('dragover'); }));
  drop.addEventListener('drop', e => {
    const file = e.dataTransfer.files[0];
    if (file) { fileInput.files = e.dataTransfer.files; showFile(file); }
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    form.querySelectorAll('.form-group.has-error').forEach(g => g.classList.remove('has-error'));

    let ok = true;
    const flag = (el, message) => {
      const group = el.closest('.form-group');
      group.classList.add('has-error');
      group.querySelector('.field-error').textContent = message;
      ok = false;
    };

    if (!titleInput.value.trim()) flag(titleInput, 'Quiz title is required.');
    if (!courseSelect.value) flag(courseSelect, 'Please select a course.');
    if (!fileInput.files.length) {
      fileError.closest('.form-group').classList.add('has-error');
      fileError.textContent = 'Please upload a Word document.';
      ok = false;
    }
    if (!ok) return;

    const file = fileInput.files[0];
    const status = document.querySelector('input[name="quizStatus"]:checked').value;
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

    localStorage.setItem('jp_pending_quiz', JSON.stringify({
      title: titleInput.value.trim(),
      course: courseSelect.value,
      file: file.name,
      size: (file.size / 1024).toFixed(1) + ' KB',
      date: today,
      status
    }));

    JP.toast(`Quiz "${titleInput.value.trim()}" uploaded successfully.`);
    setTimeout(() => { window.location.href = 'uploader-quizzes.html'; }, 700);
  });
});
