let highestZ = 1;

class PaperMobile {
  holdingPaper = false;
  touchStartX = 0;
  touchStartY = 0;
  touchMoveX = 0;
  touchMoveY = 0;
  touchEndX = 0;
  touchEndY = 0;
  prevTouchX = 0;
  prevTouchY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    // Prevent default touch behaviors to avoid scrolling while dragging
    paper.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if(this.holdingPaper) return; 
      this.holdingPaper = true;
      
      paper.style.zIndex = highestZ;
      highestZ += 1;
      
      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
      this.prevTouchX = this.touchStartX;
      this.prevTouchY = this.touchStartY;
    }, { passive: false });

    paper.addEventListener('touchmove', (e) => {
      e.preventDefault();
      if(!this.rotating) {
        this.touchMoveX = e.touches[0].clientX;
        this.touchMoveY = e.touches[0].clientY;
        
        this.velX = this.touchMoveX - this.prevTouchX;
        this.velY = this.touchMoveY - this.prevTouchY;
      }
        
      const dirX = e.touches[0].clientX - this.touchStartX;
      const dirY = e.touches[0].clientY - this.touchStartY;
      const dirLength = Math.sqrt(dirX*dirX+dirY*dirY);
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;

      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = 180 * angle / Math.PI;
      degrees = (360 + Math.round(degrees)) % 360;
      if(this.rotating) {
        this.rotation = degrees;
      }

      if(this.holdingPaper) {
        if(!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }
        this.prevTouchX = this.touchMoveX;
        this.prevTouchY = this.touchMoveY;

        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    }, { passive: false });

    paper.addEventListener('touchend', (e) => {
      e.preventDefault();
      this.holdingPaper = false;
      this.rotating = false;
    }, { passive: false });

    // Handle two-finger rotation for mobile devices
    paper.addEventListener('gesturestart', (e) => {
      e.preventDefault();
      this.rotating = true;
    }, { passive: false });
    
    paper.addEventListener('gestureend', (e) => {
      e.preventDefault();
      this.rotating = false;
    }, { passive: false });

    // Alternative rotation handling for devices that don't support gesture events
    let initialDistance = 0;
    let initialRotation = 0;

    paper.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        this.rotating = true;
        
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        initialDistance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) + 
          Math.pow(touch2.clientY - touch1.clientY, 2)
        );
        initialRotation = this.rotation;
      }
    }, { passive: false });

    paper.addEventListener('touchmove', (e) => {
      if (e.touches.length === 2 && this.rotating) {
        e.preventDefault();
        
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const currentDistance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) + 
          Math.pow(touch2.clientY - touch1.clientY, 2)
        );
        
        const centerX = (touch1.clientX + touch2.clientX) / 2;
        const centerY = (touch1.clientY + touch2.clientY) / 2;
        
        const angle = Math.atan2(touch2.clientY - touch1.clientY, touch2.clientX - touch1.clientX);
        const degrees = (angle * 180) / Math.PI;
        
        this.rotation = degrees;
        
        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    }, { passive: false });
  }
}

// Only initialize mobile touch events if we're on a touch device
if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
  const papers = Array.from(document.querySelectorAll('.paper'));
  
  papers.forEach(paper => {
    const p = new PaperMobile();
    p.init(paper);
  });
}
