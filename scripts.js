const isMemberPage = window.location.pathname.includes('/members/');
const assetBase = isMemberPage ? '../' : './';

const dataSources = {
  team: `${assetBase}data/team.json`,
  events: `${assetBase}data/events.json`,
};

const normalizeAsset = (path) => {
  if (!path) return `${assetBase}assets/images/placeholders/member-placeholder.svg`;
  if (path.startsWith('http') || path.startsWith('../')) return path;
  return isMemberPage ? `../${path.replace(/^\.\//, '')}` : path;
};

const fetchJson = async (path) => {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Unable to load ${path}: ${response.status}`);
  return response.json();
};

const setActiveNav = () => {
  const file = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a').forEach((link) => {
    const target = link.getAttribute('href')?.split('/').pop();
    if (target === file || (isMemberPage && target === 'team.html')) {
      link.classList.add('active');
    }
  });
};

const initMenu = () => {
  const shell = document.querySelector('.nav-shell');
  const toggle = document.querySelector('.menu-toggle');
  if (!shell || !toggle) return;

  toggle.addEventListener('click', () => shell.classList.toggle('open'));
  shell.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => shell.classList.remove('open'));
  });
  document.addEventListener('click', (event) => {
    if (!shell.contains(event.target)) shell.classList.remove('open');
  });
};

const revealOnScroll = () => {
  const items = document.querySelectorAll('.reveal, .section-head, .card, .team-card, .stat-card, .profile-card, .contact-form');
  if (!('IntersectionObserver' in window)) {
    items.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  items.forEach((item, index) => {
    item.style.setProperty('--reveal-delay', `${Math.min(index % 6, 5) * 70}ms`);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-popping');
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  items.forEach((item) => observer.observe(item));
};

const addHeroSignal = () => {
  document.querySelectorAll('.hero-visual').forEach((visual) => {
    if (visual.querySelector('.signal-panel')) return;

    const signal = document.createElement('div');
    signal.className = 'signal-panel';
    signal.setAttribute('aria-hidden', 'true');
    signal.innerHTML = `
      <span class="signal-ring"></span>
      <span class="signal-core"></span>
      <span class="signal-line line-one"></span>
      <span class="signal-line line-two"></span>
      <span class="signal-line line-three"></span>
    `;
    visual.appendChild(signal);
  });
};

const initTilt = () => {
  document.querySelectorAll('[data-tilt]').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty('--tilt-x', `${y * -7}deg`);
      card.style.setProperty('--tilt-y', `${x * 7}deg`);
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
    });
  });
};

const createTeamCard = (member) => {
  const card = document.createElement('a');
  card.href = `${assetBase}members/${member.slug}.html`;
  card.className = 'team-card';
  card.setAttribute('data-tilt', '');
  card.innerHTML = `
    <span class="team-orbit" aria-hidden="true"></span>
    <img src="${normalizeAsset(member.profile_img)}" alt="${member.name}" />
    <div>
      <h3>${member.name}</h3>
      <p class="role">${member.position}</p>
    </div>
    <p>${member.bio}</p>
    <span class="profile-link">Open profile</span>
  `;
  return card;
};

const renderTeam = (team) => {
  document.querySelectorAll('[data-team-grid]').forEach((grid) => {
    grid.innerHTML = '';
    team.forEach((member) => grid.appendChild(createTeamCard(member)));
  });

  const preview = document.querySelector('[data-team-preview]');
  if (preview) {
    preview.innerHTML = '';
    team.slice(0, 3).forEach((member) => preview.appendChild(createTeamCard(member)));
  }
};

const createEventCard = (event) => {
  const card = document.createElement('article');
  card.className = 'card event-card';
  card.setAttribute('data-tilt', '');
  const image = normalizeAsset(event.pictures?.[0] || './assets/images/placeholders/event-placeholder.svg');
  card.innerHTML = `
    <img src="${image}" alt="${event.name}" />
    <div class="event-card-body">
      <div class="card-badge">${event.category || 'Activity'}</div>
      <h3>${event.name}</h3>
      <p>${event.summary}</p>
      <small>${event.date || 'Date placeholder'}</small>
    </div>
  `;
  return card;
};

const renderEvents = (events) => {
  document.querySelectorAll('[data-event-grid]').forEach((grid) => {
    grid.innerHTML = '';
    events.forEach((event) => grid.appendChild(createEventCard(event)));
  });

  const preview = document.querySelector('[data-event-preview]');
  if (preview) {
    preview.innerHTML = '';
    events.slice(0, 3).forEach((event) => preview.appendChild(createEventCard(event)));
  }
};

const renderMemberProfile = (team) => {
  const target = document.querySelector('[data-member-detail]');
  if (!target) return;

  const slug = window.location.pathname.split('/').pop().replace('.html', '');
  const member = team.find((item) => item.slug === slug);
  if (!member) {
    target.innerHTML = '<p class="section-subtitle">Member profile placeholder not found. Add this role in data/team.json.</p>';
    return;
  }

  document.title = `${member.name} | IEDC KMCTCE`;
  const heroRole = document.querySelector('[data-member-role]');
  const heroName = document.querySelector('[data-member-name]');
  const heroBio = document.querySelector('[data-member-bio]');
  const heroImage = document.querySelector('[data-member-image]');
  if (heroRole) heroRole.textContent = member.position;
  if (heroName) heroName.textContent = member.name;
  if (heroBio) heroBio.textContent = member.bio;
  if (heroImage) {
    heroImage.src = normalizeAsset(member.profile_img);
    heroImage.alt = `${member.name} profile placeholder`;
  }

  target.innerHTML = `
    <div class="member-panel">
      <div class="profile-card reveal">
        <img src="${normalizeAsset(member.profile_img)}" alt="${member.name}" />
      </div>
      <div class="profile-details reveal">
        <p class="card-badge">${member.position}</p>
        <h2>${member.name}</h2>
        <p>${member.detail}</p>
        <div class="profile-meta">
          <div><strong>Department</strong><small>${member.department}</small></div>
          <div><strong>Year</strong><small>${member.year}</small></div>
          <div><strong>Email</strong><small>${member.email}</small></div>
          <div><strong>Contact</strong><small>${member.contact}</small></div>
          <div><strong>LinkedIn</strong><small>${member.linkedin}</small></div>
        </div>
        <ul class="tag-list">
          ${member.expertise.map((tag) => `<li>${tag}</li>`).join('')}
        </ul>
      </div>
    </div>
  `;
};

const init = async () => {
  setActiveNav();
  initMenu();
  addHeroSignal();

  try {
    const [team, events] = await Promise.all([fetchJson(dataSources.team), fetchJson(dataSources.events)]);
    renderTeam(team);
    renderEvents(events);
    renderMemberProfile(team);
    revealOnScroll();
    initTilt();
  } catch (error) {
    console.error(error);
  }
};

window.addEventListener('DOMContentLoaded', init);
