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
(async function() {
  const gallerySection = document.getElementById('photos-gallery');
  if (!gallerySection) return;

  
  gallerySection.innerHTML = '<div class="gallery-loading">Loading photos...</div>';
  let photos = [];
  try {
    const res = await fetch('/photos/directory.json');
    const data = await res.json();
    photos = Array.isArray(data) ? data : (Array.isArray(data.photos) ? data.photos : []);
  } catch (e) {
    gallerySection.innerHTML = '<p style="color:red">Could not load photos.</p>';
    return;
  }
  if (!Array.isArray(photos) || photos.length === 0) {
    gallerySection.innerHTML = '<p style="color:var(--gallery-month,#4e9cff);font-size:1.2em;">No photos found.</p>';
    return;
  }

  
  function parseDate(str) {
    if (!str) return { year: 'Unknown', month: 'Unknown' };
    const d = new Date(str);
    if (!isNaN(d)) {
      return {
        year: d.getFullYear(),
        month: d.toLocaleString('default', { month: 'long' })
      };
    }
    // try YYYY-MM or YYYY
    const m = str.match(/^(\d{4})(?:-(\d{2}))?/);
    if (m) {
      return {
        year: m[1],
        month: m[2] ? new Date(m[1] + '-' + m[2] + '-01').toLocaleString('default', { month: 'long' }) : 'Unknown'
      };
    }
    return { year: 'Unknown', month: 'Unknown' };
  }

  
  const grouped = {};
  for (const photo of photos) {
    
    let src = '';
    if (photo.url) src = photo.url;
    else if (photo.path) src = photo.path;
    else if (photo.file) src = photo.file;
    else if (photo.filename) src = photo.filename;
    
    if (src.startsWith('./')) src = src.slice(2);
    if (!src.startsWith('/')) src = '/photos/' + src;
    src = src.replace(/\/+/g, '/').replace(/\/photos\/photos\//, '/photos/');
    photo._src = src;
    const { year, month } = parseDate(photo.date);
    if (!grouped[year]) grouped[year] = {};
    if (!grouped[year][month]) grouped[year][month] = [];
    grouped[year][month].push(photo);
  }

  
  const yearOrder = Object.keys(grouped).sort((a, b) => b.localeCompare(a));
  const monthOrder = [
    'January','February','March','April','May','June','July','August','September','October','November','December','Unknown'
  ];

  
  let html = '';
  for (const year of yearOrder) {
    html += `
      <div class="photos-year-row">
        <hr class="photos-year-hr"><span class="photos-year">${year}</span><hr class="photos-year-hr">
      </div>
    `;
    const months = Object.keys(grouped[year]).sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b));
    for (const month of months) {
      html += `<div class="photos-month-row"><span class="photos-month">${month}</span></div>`;
      
      html += `<div class="photos-grid watermark-grid">
        <div class="month-watermark"></div>`;
      for (const photo of grouped[year][month]) {
        html += `
          <div class="photo-card-gallery">
            <div class="photo-img-wrap">
              <img src="${photo._src}" alt="${photo.description ? photo.description.replace(/"/g,'&quot;') : ''}" loading="lazy" />
            </div>
            <div class="photo-meta">
              <div class="photo-desc">${photo.description || ''}</div>
              <div class="photo-date">${photo.date || ''}</div>
            </div>
          </div>
        `;
      }
      html += '</div>';
    }
  }
  gallerySection.innerHTML = `<div class="gallery-outer site-content">${html}</div>`;
})();
