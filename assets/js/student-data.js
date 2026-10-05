/* =========================================================
   Shared mock data + helpers for the Student role screens
   (Dashboard, My Courses, My Quizzes, Certificates & CEUs)
   ========================================================= */

const STUDENT = (() => {

  /* Local course cover art (assets/images/courses/) */
  const THUMBS = {
    'The Science of Self-Compassion':      { image: 'assets/images/courses/self-compassion.jpg',      icon: 'fa-heart',              grad: ['#1c9a5b', '#0e6b3d'] },
    'Developing a Growth Mindset':         { image: 'assets/images/courses/growth-mindset.jpg',         icon: 'fa-seedling',           grad: ['#3fae7b', '#1c7a4f'] },
    'Crisis Management in Schools':        { image: 'assets/images/courses/crisis-management.jpg',    icon: 'fa-people-group',       grad: ['#64748b', '#334155'] },
    'Mindfulness for Daily Life':          { image: 'assets/images/courses/mindfulness.jpg',          icon: 'fa-water',              grad: ['#3b82f6', '#1d4ed8'] },
    'The Power of Gratitude':              { image: 'assets/images/courses/gratitude.jpg',            icon: 'fa-sun',                grad: ['#e2a63c', '#c9840f'] },
    'Overcoming Procrastination':          { image: 'assets/images/courses/procrastination.jpg',      icon: 'fa-hourglass-half',     grad: ['#8b5cf6', '#6027d6'] },
    'Stress Management Techniques':        { image: 'assets/images/courses/stress-management.jpg',    icon: 'fa-spa',                grad: ['#0e9aa7', '#0a6b74'] },
    'Building Emotional Resilience':       { image: 'assets/images/courses/emotional-resilience.jpg', icon: 'fa-hand-holding-heart', grad: ['#e0483f', '#b8241c'] },
    'Positive Parenting Strategies':       { image: 'assets/images/courses/parenting.jpg',            icon: 'fa-child-reaching',     grad: ['#c98a3e', '#9c6624'] },
    'Effective Communication Skills':      { image: 'assets/images/courses/communication.jpg',        icon: 'fa-comments',           grad: ['#3b82f6', '#2554b8'] },
    'The Impact of Spirituality on Therapy': { image: 'assets/images/courses/spirituality.jpg',       icon: 'fa-dove',               grad: ['#6366f1', '#4338ca'] },
    'Positive Discipline for Students':    { image: 'assets/images/courses/discipline.jpg',           icon: 'fa-graduation-cap',     grad: ['#1c9a5b', '#146b3f'] }
  };

  function thumb(title, size = 'sm') {
    const t = THUMBS[title] || { icon: 'fa-book-open', grad: ['#1f6b4f', '#123a30'] };
    const alt = String(title).replace(/"/g, '&quot;');
    if (t.image) {
      const grad = `${t.grad[0]},${t.grad[1]}`;
      return `<div class="course-thumb ${size}" data-thumb-fallback="${t.icon}" data-thumb-grad="${grad}"><img src="${t.image}" alt="${alt}" loading="lazy" decoding="async"></div>`;
    }
    const style = `background:linear-gradient(135deg, ${t.grad[0]}, ${t.grad[1]})`;
    return `<div class="course-thumb ${size}" style="${style}"><i class="fa-solid ${t.icon}"></i></div>`;
  }

  const courses = [
    { title: 'The Science of Self-Compassion', instructor: 'Kerri-Ann Pearl', progress: 75,  status: 'In Progress', lastAccessed: 'May 20, 2024 10:30 AM' },
    { title: 'Developing a Growth Mindset',     instructor: 'Sarah Brown',     progress: 60,  status: 'In Progress', lastAccessed: 'May 18, 2024 09:15 AM' },
    { title: 'Crisis Management in Schools',    instructor: 'Michael Lee',     progress: 40,  status: 'In Progress', lastAccessed: 'May 15, 2024 02:45 PM' },
    { title: 'Mindfulness for Daily Life',      instructor: 'Emily Davis',     progress: 20,  status: 'In Progress', lastAccessed: 'May 12, 2024 11:20 AM' },
    { title: 'The Power of Gratitude',          instructor: 'David Wilson',    progress: 100, status: 'Completed',   lastAccessed: 'Apr 30, 2024 04:10 PM' },
    { title: 'Overcoming Procrastination',      instructor: 'Emily Davis',     progress: 100, status: 'Completed',   lastAccessed: 'Apr 28, 2024 03:30 PM' },
    { title: 'Stress Management Techniques',    instructor: 'Michael Lee',     progress: 100, status: 'Completed',   lastAccessed: 'Apr 20, 2024 01:45 PM' },
    { title: 'Building Emotional Resilience',   instructor: 'Sarah Brown',     progress: 0,   status: 'Not Started', lastAccessed: '—' }
  ];

  const quizzes = [
    { title: 'The Science of Self-Compassion Quiz', course: 'The Science of Self-Compassion', questions: 25, uploadedOn: 'May 10, 2024', dueDate: 'May 25, 2024 11:59 PM',
      submission: { file: 'Self_Compassion_Answers.docx', size: '245 KB', submittedOn: 'May 25, 2024 11:59 PM', status: 'Submitted' } },
    { title: 'Developing a Growth Mindset Quiz', course: 'Developing a Growth Mindset', questions: 20, uploadedOn: 'May 8, 2024', dueDate: 'May 22, 2024 11:59 PM',
      submission: { file: 'Growth_Mindset_Answers.docx', size: '312 KB', submittedOn: 'May 22, 2024 11:59 PM', status: 'Submitted' } },
    { title: 'Crisis Management in Schools Quiz', course: 'Crisis Management in Schools', questions: 30, uploadedOn: 'May 6, 2024', dueDate: 'May 20, 2024 11:59 PM',
      submission: { file: 'Crisis_Management_Answers.docx', size: '278 KB', submittedOn: 'May 20, 2024 11:59 PM', status: 'Submitted' } },
    { title: 'Mindfulness for Daily Life Quiz', course: 'Mindfulness for Daily Life', questions: 15, uploadedOn: 'May 5, 2024', dueDate: 'May 19, 2024 11:59 PM',
      submission: { file: 'Mindfulness_Answers.docx', size: '192 KB', submittedOn: 'May 19, 2024 11:59 PM', status: 'Submitted' } },
    { title: 'The Power of Gratitude Quiz', course: 'The Power of Gratitude', questions: 20, uploadedOn: 'Apr 28, 2024', dueDate: 'May 12, 2024 11:59 PM',
      submission: { file: 'Gratitude_Answers.docx', size: '221 KB', submittedOn: 'May 12, 2024 11:59 PM', status: 'Submitted' } },
    { title: 'Overcoming Procrastination Quiz', course: 'Overcoming Procrastination', questions: 20, uploadedOn: 'Apr 24, 2024', dueDate: 'May 10, 2024 11:59 PM',
      submission: { file: 'Procrastination_Answers.docx', size: '205 KB', submittedOn: 'May 10, 2024 11:59 PM', status: 'Submitted' } },
    { title: 'Stress Management Techniques Quiz', course: 'Stress Management Techniques', questions: 25, uploadedOn: 'Apr 18, 2024', dueDate: 'May 5, 2024 11:59 PM',
      submission: { file: 'Stress_Management_Answers.docx', size: '230 KB', submittedOn: 'May 5, 2024 11:59 PM', status: 'Submitted' } },
    { title: 'Building Emotional Resilience Quiz', course: 'Building Emotional Resilience', questions: 15, uploadedOn: 'Apr 15, 2024', dueDate: 'May 2, 2024 11:59 PM',
      submission: { file: 'Emotional_Resilience_Answers.docx', size: '188 KB', submittedOn: 'May 2, 2024 11:59 PM', status: 'Submitted' } }
  ];

  const certificates = [
    { course: 'The Science of Self-Compassion',        completedOn: 'May 25, 2024', ceus: 2.5, id: 'JP-2024-00012' },
    { course: 'Developing a Growth Mindset',            completedOn: 'May 22, 2024', ceus: 2.0, id: 'JP-2024-00011' },
    { course: 'Crisis Management in Schools',           completedOn: 'May 20, 2024', ceus: 3.0, id: 'JP-2024-00010' },
    { course: 'Mindfulness for Daily Life',              completedOn: 'May 19, 2024', ceus: 1.5, id: 'JP-2024-00009' },
    { course: 'The Power of Gratitude',                  completedOn: 'May 12, 2024', ceus: 2.0, id: 'JP-2024-00008' },
    { course: 'Overcoming Procrastination',              completedOn: 'May 10, 2024', ceus: 2.0, id: 'JP-2024-00007' },
    { course: 'Stress Management Techniques',            completedOn: 'May 5, 2024',  ceus: 2.5, id: 'JP-2024-00006' },
    { course: 'Building Emotional Resilience',           completedOn: 'May 2, 2024',  ceus: 1.0, id: 'JP-2024-00005' },
    { course: 'Positive Parenting Strategies',           completedOn: 'Apr 26, 2024', ceus: 2.0, id: 'JP-2024-00004' },
    { course: 'Effective Communication Skills',          completedOn: 'Apr 20, 2024', ceus: 1.5, id: 'JP-2024-00003' },
    { course: 'The Impact of Spirituality on Therapy',   completedOn: 'Apr 14, 2024', ceus: 3.0, id: 'JP-2024-00002' },
    { course: 'Positive Discipline for Students',        completedOn: 'Apr 8, 2024',  ceus: 2.0, id: 'JP-2024-00001' }
  ];

  document.addEventListener('error', (e) => {
    const img = e.target;
    if (!img.matches || !img.matches('.course-thumb img')) return;
    const wrap = img.closest('.course-thumb');
    if (!wrap || wrap.classList.contains('is-fallback')) return;
    wrap.classList.add('is-fallback');
    const icon = wrap.dataset.thumbFallback || 'fa-book-open';
    const grad = (wrap.dataset.thumbGrad || '#1f6b4f,#123a30').split(',');
    wrap.style.background = `linear-gradient(135deg, ${grad[0]}, ${grad[1]})`;
    wrap.innerHTML = `<i class="fa-solid ${icon}"></i>`;
  }, true);

  return { thumb, courses, quizzes, certificates };
})();
