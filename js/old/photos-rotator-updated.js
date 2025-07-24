window.addEventListener('DOMContentLoaded', function() {
  const rotator = document.querySelector('.featured-photos-rotator');
  if (!rotator) {
    document.body.insertAdjacentHTML('beforeend', '<div style="color:white;background:#c00;padding:1em;border-radius:8px;position:fixed;bottom:2em;left:2em;z-index:9999;">Error: Club Photos container not found. Check your HTML for <code>.featured-photos-rotator</code>.</div>');
    return;
  }

  fetch('/photos/directory.json')
    .then(res => {
      if (!res.ok) throw new Error('HTTP status ' + res.status);
      return res.json();
    })
    .then(data => {
      const photos = Array.isArray(data.photos) ? data.photos : [];
      const featured = photos.filter(p => p.featured);
      if (!featured.length) {
        rotator.innerHTML = '<p style="color:white">No featured photos found.</p>';
        return;
      }
      let current = 0;
      function renderPhoto(idx) {
        rotator.innerHTML = '';
        const photo = featured[idx];
        const card = document.createElement('div');
        card.className = 'photo-card photo-animate';
        const img = document.createElement('img');
        let imgPath = photo.file;
        if (!imgPath.startsWith('/')) imgPath = '/' + imgPath;
        img.src = imgPath;
        img.alt = photo.description || 'Club Photo';
        card.appendChild(img);
        const info = document.createElement('div');
        info.className = 'photo-info';
        
        let formattedDate = '';
        if (photo.date) {
          const d = new Date(photo.date);
          if (!isNaN(d)) {
            formattedDate = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
          } else {
            formattedDate = photo.date;
          }
        }
        info.innerHTML = `<strong>${photo.description || ''}</strong><br><span>${formattedDate}</span>`;
        card.appendChild(info);
        rotator.appendChild(card);
        img.onerror = function() {
          info.innerHTML += `<br><span style='color:red;font-size:0.8em;'>Image not found: ${img.src}</span>`;
        };
        
        card.style.opacity = '0';
        card.style.transform = 'translateY(100vh) scale(0.9)';
        setTimeout(() => {
          card.style.transition = 'transform 0.7s cubic-bezier(.77,0,.18,1), opacity 0.7s';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0) scale(1)';
        }, 10);
        
        setTimeout(() => {
          card.style.opacity = '0';
          card.style.transform = 'translateY(-100vh) scale(0.9)';
          setTimeout(() => {
            current = (current + 1) % featured.length;
            renderPhoto(current);
          }, 700); 
        }, 2600); 
      }
      renderPhoto(current);
    })
    .catch(e => {
      rotator.innerHTML = '<p style="color:white">Could not load photos.</p>';
    });
});
