window.addEventListener('load', function() {
  console.log('photos-rotator.js loaded');
  (async function() {
    const rotator = document.querySelector('.featured-photos-rotator');
    if (!rotator) {
      document.body.insertAdjacentHTML('beforeend', '<div style="color:white;background:#c00;padding:1em;border-radius:8px;position:fixed;bottom:2em;left:2em;z-index:9999;">Error: Club Photos container not found. Check your HTML for <code>.featured-photos-rotator</code>.</div>');
      console.log('No .featured-photos-rotator found');
      return;
    }

  
    let photos = [];
    try {
      console.log('Fetching /images/photos/directory.json ...');
      const res = await fetch('/images/photos/directory.json');
      if (!res.ok) {
        throw new Error('HTTP status ' + res.status);
      }
      const data = await res.json();
      photos = Array.isArray(data.photos) ? data.photos : [];
      console.log('Loaded photos:', photos);
    } catch (e) {
      rotator.innerHTML = '<p style="color:white">Could not load photos.</p>';
      console.error('Error loading photos:', e);
      return;
    }

    const featured = photos.filter(p => p.featured);
    console.log('Featured photos:', featured);
    if (!featured.length) {
      rotator.innerHTML = '<p style="color:white">No featured photos found.</p>';
      return;
    }

    let current = 0;
    function showPhoto(idx) {
      rotator.innerHTML = '';
      const photo = featured[idx];
      const card = document.createElement('div');
      card.className = 'photo-card';
      const img = document.createElement('img');
      
      let imgPath = photo.file;
      if (!imgPath.startsWith('/')) {
        imgPath = '/' + imgPath;
      }
      img.src = imgPath;
      img.alt = photo.description || 'Club Photo';
      card.appendChild(img);
      console.log('Displaying photo:', imgPath);
      const info = document.createElement('div');
      info.className = 'photo-info';
      info.innerHTML = `<strong>${photo.description || ''}</strong><br><span>${photo.date || ''}</span>`;
      card.appendChild(info);
      rotator.appendChild(card);
      
      img.onerror = function() {
        info.innerHTML += `<br><span style='color:red;font-size:0.8em;'>Image not found: ${img.src}</span>`;
        console.error('Image not found:', img.src);
      };
      
      setTimeout(() => {
        card.classList.remove('fade-out');
        info.classList.remove('fade-out');
      }, 10);
      
      setTimeout(() => {
        card.classList.add('fade-out');
        info.classList.add('fade-out');
        setTimeout(() => {
          current = (current + 1) % featured.length;
          showPhoto(current);
        }, 700);
      }, 2600);
    }
    showPhoto(current);
  })();
});
