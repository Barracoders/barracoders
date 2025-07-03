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
function formatEventDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}
function renderEvents(events) {
  const eventsList = document.getElementById('events-list');
  if (!eventsList) return;
  eventsList.innerHTML = '';
  if (events.length === 0) {
    eventsList.innerHTML = '<p>No events found.</p>';
    return;
  }
  events.forEach(event => {
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
function getEventCategories(events) {
  const cats = new Set();
  events.forEach(e => {
    if (e.category) cats.add(e.category);
  });
  return Array.from(cats);
}
function renderCategoryOptions(categories) {
  const select = document.getElementById('event-category');
  if (!select) return;
  select.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(cat => {
    select.innerHTML += `<option value="${cat}">${cat}</option>`;
  });
}
function filterAndRenderEvents(events) {
  const search = document.getElementById('event-search').value.toLowerCase();
  const field = document.getElementById('event-field').value;
  let filtered = events.filter(e => {
    if (!search) return true;
    if (field === 'all') {
      return (
        (e.title && e.title.toLowerCase().includes(search)) ||
        (e.date && e.date.toLowerCase().includes(search)) ||
        (e.location && e.location.toLowerCase().includes(search)) ||
        (e.description && e.description.toLowerCase().includes(search))
      );
    } else {
      return (e[field] && e[field].toLowerCase().includes(search));
    }
  });
  renderEvents(filtered);
}
let allEvents = [];
fetch('/calendar/events.json')
  .then(res => res.json())
  .then(data => {
    data.sort((a, b) => new Date(a.date) - new Date(b.date));
    allEvents = data;
    renderCategoryOptions(getEventCategories(data));
    renderEvents(data);
  });
document.addEventListener('DOMContentLoaded', function() {
  const search = document.getElementById('event-search');
  const field = document.getElementById('event-field');
  if (search) search.addEventListener('input', () => filterAndRenderEvents(allEvents));
  if (field) field.addEventListener('change', () => filterAndRenderEvents(allEvents));
});
