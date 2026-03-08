document.addEventListener('DOMContentLoaded', function() {
  const collageContainer = document.querySelector('.collage-container');
  if (!collageContainer) {
    console.error('Collage container not found');
    return;
  }

  fetch('/photos/directory.json')
    .then(res => {
      if (!res.ok) throw new Error('HTTP status ' + res.status);
      return res.json();
    })
    .then(data => {
      const photos = Array.isArray(data.photos) ? data.photos : [];
      // Sort photos so featured ones appear first
      photos.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      });
      // Display all photos, with featured ones first
      photos.forEach(photo => {
        const img = document.createElement('img');
        let imgPath = photo.file;
        if (!imgPath.startsWith('/')) imgPath = '/' + imgPath;
        img.src = imgPath;
        img.alt = photo.description || 'Club Photo';
        img.loading = 'lazy'; // Lazy load for performance
        collageContainer.appendChild(img);
      });
    })
    .catch(error => {
      console.error('Error loading photos:', error);
      collageContainer.innerHTML = '<p>Unable to load photos at this time.</p>';
    });
});