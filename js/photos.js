//i need to work on this and make it actually function better lol
document.querySelectorAll('.photo-gallery img').forEach((img) => {
    img.addEventListener('click', function () {
      const popup = document.createElement('div');
      popup.classList.add('popup');
      const popupImage = document.createElement('img');
      popupImage.src = this.src;
      popup.appendChild(popupImage);
      document.body.appendChild(popup);
  
      
      popup.addEventListener('click', function () {
        popup.remove();
      });
    });
  });
  
  // CSS to style the popup
  const style = document.createElement('style');
  style.innerHTML = `
  .popup {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  .popup img {
    max-width: 90%;
    max-height: 90%;
    border-radius: 8px;
  }
  `;
  document.head.appendChild(style);
  