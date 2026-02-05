// main.js – Hot Beans Web
// Complete script with navigation, team animation, toggles & filters

document.addEventListener('DOMContentLoaded', () => {
  // Back to Top Button
  const backToTopBtn = document.getElementById('back-to-top');

  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) { // show after scrolling down 400px
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
  console.log('Hot Beans Web – Scripts initialized');

  // ────────────────────────────────────────────────────────────────
  // 1. Active Navigation Highlighting
  // ────────────────────────────────────────────────────────────────
  const navLinks = document.querySelectorAll('.main-nav a, .footer-nav a');

  const updateActiveLink = () => {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const currentHash = window.location.hash || '';

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');

      let shouldBeActive = false;

      // Exact page match (courses.html, apply.html, contact.html, etc.)
      if (href === currentPath || href.includes(currentPath)) {
        shouldBeActive = true;
      }

      // Homepage section matching
      if ((currentPath === 'index.html' || currentPath === '') && href.includes('#')) {
        if (href === `index.html${currentHash}`) {
          shouldBeActive = true;
        }
        // Default to Home when no hash
        if (!currentHash && href === 'index.html#home') {
          shouldBeActive = true;
        }
      }

      // Root fallback
      if (currentPath === '' && href.startsWith('index.html')) {
        shouldBeActive = true;
      }

      if (shouldBeActive) {
        link.classList.add('active');
      }
    });
  };

  // Run once on load
  updateActiveLink();

  // Update when hash changes (clicking internal links on homepage)
  window.addEventListener('hashchange', updateActiveLink);

  // Update when scrolling on homepage (for dynamic section highlighting)
  if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
    window.addEventListener('scroll', () => {
      const scrollPosition = window.scrollY + 100; // offset for header

      let activeHash = '#home';
      document.querySelectorAll('section[id]').forEach(section => {
        const sectionTop = section.offsetTop;
        if (sectionTop <= scrollPosition) {
          activeHash = `#${section.id}`;
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(activeHash)) {
          link.classList.add('active');
        }
      });
    }, { passive: true });
  }

  // ────────────────────────────────────────────────────────────────
  // 2. Team Section – Gather → Spread on Scroll
  // ────────────────────────────────────────────────────────────────
  const teamSection = document.querySelector('#team');
  const teamGrid = document.querySelector('.team-grid');

  if (teamGrid && teamSection) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            teamGrid.classList.add('spread');
            observer.unobserve(entry.target); // run once
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px'
      }
    );

    observer.observe(teamSection);
  }

  // ────────────────────────────────────────────────────────────────
  // 3. Apply Page – Toggle "View details"
  // ────────────────────────────────────────────────────────────────
  document.querySelectorAll('.btn-toggle').forEach(btn => {
    btn.addEventListener('click', function () {
      const card = this.closest('.role-card');
      if (!card) return;

      const details = card.querySelector('.role-details');
      if (!details) return;

      const isHidden = details.classList.contains('hidden');

      details.classList.toggle('hidden');
      this.textContent = isHidden ? 'Hide details' : 'View details';
    });
  });

  // ────────────────────────────────────────────────────────────────
  // 4. Apply Page – Job Filters (All / Remote / Hybrid / On-site)
  // ────────────────────────────────────────────────────────────────
  const jobFilters = document.querySelectorAll('.filter-btn');
  const jobCards = document.querySelectorAll('#jobList .role-card');

  if (jobFilters.length && jobCards.length) {
    jobFilters.forEach(filterBtn => {
      filterBtn.addEventListener('click', () => {
        jobFilters.forEach(btn => btn.classList.remove('active'));
        filterBtn.classList.add('active');

        const filterValue = filterBtn.dataset.filter;

        jobCards.forEach(card => {
          const location = card.dataset.location;
          const shouldShow = filterValue === 'all' || location === filterValue;
          card.classList.toggle('hidden', !shouldShow);
        });
      });
    });
  }

  // ────────────────────────────────────────────────────────────────
  // 5. Courses Page – Filtering (All / Free / Paid / Beginner / Intermediate)
  // ────────────────────────────────────────────────────────────────
  const courseFilters = document.querySelectorAll('.filter-btn');
  const courseCards = document.querySelectorAll('#courseList .course-card');

  if (courseFilters.length && courseCards.length) {
    courseFilters.forEach(filterBtn => {
      filterBtn.addEventListener('click', () => {
        courseFilters.forEach(btn => btn.classList.remove('active'));
        filterBtn.classList.add('active');

        const filter = filterBtn.dataset.filter;

        courseCards.forEach(card => {
          const type = card.dataset.type;
          const level = card.dataset.level;

          let shouldShow = filter === 'all';

          if (filter === 'free' || filter === 'paid') {
            shouldShow = type === filter;
          } else if (filter === 'beginner' || filter === 'intermediate') {
            shouldShow = level === filter;
          }

          card.classList.toggle('hidden', !shouldShow);
        });
      });
    });
  }

  console.log('All features ready');
});