/* =========================================================
   Student Dashboard — Continue Learning, deadlines,
   recent activity and recent achievements
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  const continueHost = document.getElementById('continueLearningList');
  if (!continueHost) return;

  /* ---------------- Continue Learning ---------------- */
  const inProgress = STUDENT.courses.filter(c => c.status === 'In Progress');
  continueHost.innerHTML = inProgress.map(c => `
    <div class="continue-row">
      ${STUDENT.thumb(c.title, 'sm')}
      <div class="ci-info">
        <div class="ci-title">${JP.escape(c.title)}</div>
        <div class="progress-cell">
          <div class="progress-track"><div class="progress-fill" style="width:${c.progress}%"></div></div>
          <div class="progress-pct">${c.progress}%</div>
        </div>
      </div>
      <button class="btn btn-primary btn-continue" data-continue="${JP.escape(c.title)}">Continue</button>
    </div>`).join('');

  continueHost.querySelectorAll('[data-continue]').forEach(btn => {
    btn.addEventListener('click', () => JP.comingSoon(`${btn.dataset.continue} — Course Player`, 'page'));
  });

  /* ---------------- Upcoming Deadlines ---------------- */
  const deadlines = [
    { title: 'The Power of Gratitude Quiz', due: 'Due in 2 days' },
    { title: 'Stress Management Techniques Workshop', due: 'Due in 5 days' },
    { title: 'Developing a Growth Mindset Quiz', due: 'Due in 7 days' }
  ];
  document.getElementById('deadlinesList').innerHTML = deadlines.map(d => `
    <div class="deadline-item">
      <div class="di-icon"><i class="fa-solid fa-calendar-days"></i></div>
      <div>
        <div class="di-title">${JP.escape(d.title)}</div>
        <div class="di-due">${JP.escape(d.due)}</div>
      </div>
    </div>`).join('');

  /* ---------------- Recent Activity ---------------- */
  const activity = [
    { icon: 'fa-circle-check', text: 'You completed the quiz "Mindfulness for Daily Life"', time: '2 hours ago' },
    { icon: 'fa-download',     text: 'You downloaded "The Science of Self-Compassion" quiz', time: 'Yesterday' },
    { icon: 'fa-book-open',    text: 'You enrolled in "Crisis Management in Schools"', time: 'May 18, 2024' },
    { icon: 'fa-award',        text: 'You earned a certificate in "The Science of Self-Compassion"', time: 'May 16, 2024' }
  ];
  document.getElementById('recentActivityList').innerHTML = activity.map(a => `
    <div class="activity-row">
      <div class="aicon"><i class="fa-solid ${a.icon}"></i></div>
      <div class="atext">${a.text}</div>
      <div class="atime">${JP.escape(a.time)}</div>
    </div>`).join('');

  /* ---------------- Recent Achievements ---------------- */
  const achievements = [
    { kicker: 'Certificate Earned', title: 'The Science of Self-Compassion', sub: 'Earned on May 20, 2024' },
    { kicker: 'Quiz Completed',     title: 'Mindfulness for Daily Life',     sub: 'Score: 92% · May 18, 2024' }
  ];
  document.getElementById('achievementsList').innerHTML = achievements.map(a => `
    <div class="achievement-item">
      <div class="ai-icon"><i class="fa-solid fa-award"></i></div>
      <div class="ai-body">
        <div class="ai-kicker">${JP.escape(a.kicker)}</div>
        <div class="ai-title">${JP.escape(a.title)}</div>
        <div class="ai-sub">${JP.escape(a.sub)}</div>
      </div>
    </div>`).join('');
});
