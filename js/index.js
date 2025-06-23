window.addEventListener('scroll', function () {
  const navbar = document.getElementById('navbar');
  const hero = document.getElementById('hero');
  const logoSmall = document.getElementById('logo-small');
  const scrollTrigger = hero.offsetHeight * 0.3;

  if (window.scrollY > scrollTrigger) {
    navbar.classList.add('shrink');
  } else {
    navbar.classList.remove('shrink');
  }
});
