const toggleButton = document.getElementById('mode-toggle');
  const modeIcon = document.getElementById('mode-icon');
  const body = document.body;
  const logoSmall = document.getElementById('logo-small');

  
  let darkMode = false;

  toggleButton.addEventListener('click', () => {
    darkMode = !darkMode;

    if (darkMode) {
      body.classList.remove('light-mode');
      body.classList.add('dark-mode');
      logoSmall.src = '/images/logos/coders_white_cropped.png';
      modeIcon.classList.remove('fa-moon');
      modeIcon.classList.add('fa-sun');
    } else {
      body.classList.remove('dark-mode');
      body.classList.add('light-mode');
      logoSmall.src = '/images/logos/logo-green-ver.png';
      modeIcon.classList.remove('fa-sun');
      modeIcon.classList.add('fa-moon');
    }
  });

  
  window.addEventListener('DOMContentLoaded', () => {
    body.classList.add('light-mode');
  });

  
  window.addEventListener('scroll', function () {
    const navbar = document.getElementById('navbar');
    const hero = document.getElementById('hero');
    const scrollTrigger = hero.offsetHeight * 0.3;

    if (window.scrollY > scrollTrigger) {
      navbar.classList.add('shrink');
    } else {
      navbar.classList.remove('shrink');
    }
  });


function formatEventDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function isUpcoming(dateStr) {
  const today = new Date();
  today.setHours(0,0,0,0);
  const eventDate = new Date(dateStr);
  eventDate.setHours(0,0,0,0);
  return eventDate >= today;
}

function renderEvents(events) {
  const eventsList = document.getElementById('events-list');
  if (!eventsList) return;
  eventsList.innerHTML = '';
  if (events.length === 0) {
    eventsList.innerHTML = '<p>No upcoming events.</p>';
    return;
  }
  events.slice(0, 5).forEach(event => {
    const eventDiv = document.createElement('div');
    eventDiv.className = 'event-card';
    eventDiv.innerHTML = `
      <div class="event-title">${event.title}</div>
      <div class="event-date">${formatEventDate(event.date)} &bull; ${event.time}</div>
      <div class="event-location">${event.location}</div>
      ${event.description ? `<div class="event-desc">${event.description}</div>` : ''}
      ${event.link ? `<a href="${event.link}" target="_blank" class="event-link">More Info</a>` : ''}
    `;
    eventsList.appendChild(eventDiv);
  });
}

fetch('/calendar/events.json')
  .then(res => res.json())
  .then(data => {
    const upcoming = data.filter(e => isUpcoming(e.date));
    upcoming.sort((a, b) => new Date(a.date) - new Date(b.date));
    renderEvents(upcoming);
  });

// i borrowed the code below me lol
function applyMode(mode) {
  const body = document.body;
  const logoSmall = document.getElementById('logo-small');
  const modeIcon = document.getElementById('mode-icon');
  if (mode === 'dark-mode') {
    body.classList.remove('light-mode');
    body.classList.add('dark-mode');
    if (logoSmall) logoSmall.src = '/images/logos/coders_white_cropped.png';
    if (modeIcon) {
      modeIcon.classList.remove('fa-moon');
      modeIcon.classList.add('fa-sun');
    }
  } else {
    body.classList.remove('dark-mode');
    body.classList.add('light-mode');
    if (logoSmall) logoSmall.src = '/images/logos/logo-green-ver.png';
    if (modeIcon) {
      modeIcon.classList.remove('fa-sun');
      modeIcon.classList.add('fa-moon');
    }
  }
}

function getSavedMode() {
  return localStorage.getItem('theme') || 'light-mode';
}

function saveMode(mode) {
  localStorage.setItem('theme', mode);
}

window.addEventListener('DOMContentLoaded', () => {
  const savedMode = getSavedMode();
  applyMode(savedMode);

  const toggleButton = document.getElementById('mode-toggle');
  if (toggleButton) {
    toggleButton.addEventListener('click', () => {
      const currentMode = document.body.classList.contains('dark-mode') ? 'dark-mode' : 'light-mode';
      const newMode = currentMode === 'dark-mode' ? 'light-mode' : 'dark-mode';
      applyMode(newMode);
      saveMode(newMode);
    });
  }
});