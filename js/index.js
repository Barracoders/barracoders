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