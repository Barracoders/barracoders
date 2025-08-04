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
      if (featured.length < 1) {
        rotator.innerHTML = '<p style="color:white">no featured photos found.</p>';
        return;
      }
      let current = 0;

      function getIndex(offset) {
        return (current + offset + featured.length) % featured.length;
      }

      function createCard(photo, sizeClass, blurClass) {
        const card = document.createElement('div');
        card.className = `photo-card ${sizeClass} ${blurClass}`;
        const img = document.createElement('img');
        let imgPath = photo.file;
        if (!imgPath.startsWith('/')) imgPath = '/' + imgPath;
        img.src = imgPath;
        img.alt = photo.description || 'Club Photo';
        card.appendChild(img);

        const info = document.createElement('div');
        info.className = 'photo-info';
        const inner = document.createElement('div');
        inner.className = 'photo-info-inner';
        const desc = document.createElement('div');
        desc.className = 'photo-info-description';
        desc.textContent = photo.description || '';
        inner.appendChild(desc);
        let formattedDate = '';
        if (photo.date) {
          const d = new Date(photo.date);
          if (!isNaN(d)) {
            formattedDate = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
          } else {
            formattedDate = photo.date;
          }
        }
        const dateDiv = document.createElement('div');
        dateDiv.className = 'photo-info-date';
        dateDiv.textContent = formattedDate;
        inner.appendChild(dateDiv);
        info.appendChild(inner);
        card.appendChild(info);
        img.onerror = function() {
          desc.innerHTML += `<br><span style='color:red;font-size:0.8em;'>Image not found: ${img.src}</span>`;
        };
        return card;
      }

      
      let cardNodes = [];
      function renderCarousel(init = false) {
        const positions = [
          { offset: 2,  size: 'photo-size-xs', blur: 'photo-blur-xs' },
          { offset: 1,  size: 'photo-size-sm', blur: 'photo-blur-sm' },
          { offset: 0,  size: 'photo-size-main', blur: 'photo-blur-none' },
          { offset: -1, size: 'photo-size-sm', blur: 'photo-blur-sm' },
          { offset: -2, size: 'photo-size-xs', blur: 'photo-blur-xs' }
        ];
        if (init || cardNodes.length !== 5) {
          rotator.innerHTML = '';
          cardNodes = positions.map((pos, i) => {
            const idx = getIndex(pos.offset);
            const card = createCard(featured[idx], pos.size, pos.blur);
            card.classList.add('photo-pos-' + i);
            rotator.appendChild(card);
            return card;
          });
        } else {
          positions.forEach((pos, i) => {
            const idx = getIndex(pos.offset);
            const card = cardNodes[i];
            
            card.className = 'photo-card ' + pos.size + ' ' + pos.blur + ' photo-pos-' + i;
            
            const img = card.querySelector('img');
            let imgPath = featured[idx].file;
            if (!imgPath.startsWith('/')) imgPath = '/' + imgPath;
            if (img.src !== location.origin + imgPath) {
              
              const overlay = img.cloneNode();
              overlay.src = imgPath;
              overlay.alt = featured[idx].description || 'Club Photo';
              overlay.style.position = 'absolute';
              overlay.style.left = '0';
              overlay.style.top = '0';
              overlay.style.width = '100%';
              overlay.style.height = '100%';
              overlay.style.objectFit = 'cover';
              overlay.style.borderRadius = img.style.borderRadius;
              overlay.style.opacity = '0';
              overlay.style.transition = 'opacity 0.45s cubic-bezier(.77,0,.18,1)';
              img.parentNode.appendChild(overlay);
              
              const desc = card.querySelector('.photo-info-description');
              const dateDiv = card.querySelector('.photo-info-date');
              const newDesc = desc.cloneNode();
              newDesc.textContent = featured[idx].description || '';
              newDesc.classList.add('crossfade');
              newDesc.style.opacity = '0';
              newDesc.style.transition = 'opacity 0.45s cubic-bezier(.77,0,.18,1)';
              newDesc.style.position = 'absolute';
              newDesc.style.left = '0';
              newDesc.style.right = '0';
              newDesc.style.top = desc.offsetTop + 'px';
              newDesc.style.font = getComputedStyle(desc).font;
              newDesc.style.textAlign = getComputedStyle(desc).textAlign;
              newDesc.style.lineHeight = getComputedStyle(desc).lineHeight;
              desc.parentNode.style.position = 'relative';
              desc.parentNode.appendChild(newDesc);
              let formattedDate = '';
              if (featured[idx].date) {
                const d = new Date(featured[idx].date);
                if (!isNaN(d)) {
                  formattedDate = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
                } else {
                  formattedDate = featured[idx].date;
                }
              }
              const newDate = dateDiv.cloneNode();
              newDate.textContent = formattedDate;
              newDate.classList.add('crossfade');
              newDate.style.opacity = '0';
              newDate.style.transition = 'opacity 0.45s cubic-bezier(.77,0,.18,1)';
              dateDiv.parentNode.appendChild(newDate);
              
              requestAnimationFrame(() => {
                overlay.style.opacity = '1';
                newDesc.style.opacity = '1';
                newDate.style.opacity = '1';
                desc.style.opacity = '0';
                dateDiv.style.opacity = '0';
              });
             
              setTimeout(() => {
                desc.style.visibility = 'hidden';
                dateDiv.style.visibility = 'hidden';
              }, 225);
              setTimeout(() => {
                
                img.src = imgPath;
                img.alt = featured[idx].description || 'Club Photo';
               
                overlay.parentNode.removeChild(overlay);
                
                desc.textContent = featured[idx].description || '';
                desc.style.opacity = '';
                desc.style.visibility = '';
                newDesc.parentNode.removeChild(newDesc);
                dateDiv.textContent = formattedDate;
                dateDiv.style.opacity = '';
                dateDiv.style.visibility = '';
                newDate.parentNode.removeChild(newDate);
              }, 450);
            }
          });
        }
      }

      function animateCarousel() {
        const cards = Array.from(rotator.children);
        cards.forEach(card => {
          card.style.transition = 'transform 0.7s cubic-bezier(.77,0,.18,1), filter 0.7s, opacity 0.7s';
        });
        
        setTimeout(() => {
          current = (current + 1) % featured.length;
          renderCarousel();
        }, 700);
      }

      function cycle() {
        animateCarousel();
        setTimeout(cycle, 2600);
      }

      renderCarousel(true);
      setTimeout(cycle, 2600);
    })
    .catch(e => {
      rotator.innerHTML = '<p style="color:white">Could not load photos.</p>';
    });
});
