let highestZ = 1;

class Paper {
  holdingPaper = false;
  touchStartX = 0;
  touchStartY = 0;
  touchMoveX = 0;
  touchMoveY = 0;
  prevTouchX = 0;
  prevTouchY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;
  initialRotation = 0;

  init(paper) {
    // Prevent default touch behaviors to avoid scrolling while dragging
    paper.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if(this.holdingPaper) return; 
      
      console.log('Touch started on paper!', e.touches[0].clientX, e.touches[0].clientY);
      
      this.holdingPaper = true;
      paper.style.zIndex = highestZ;
      highestZ += 1;
      
      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
      this.prevTouchX = this.touchStartX;
      this.prevTouchY = this.touchStartY;
      this.initialRotation = this.rotation;
    });

    paper.addEventListener('touchmove', (e) => {
      e.preventDefault();
      
      if(!this.holdingPaper) return;
      
      this.touchMoveX = e.touches[0].clientX;
      this.touchMoveY = e.touches[0].clientY;
      
      // Calculate velocity for smooth movement
      this.velX = this.touchMoveX - this.prevTouchX;
      this.velY = this.touchMoveY - this.prevTouchY;
      
      // Update position
      this.currentPaperX += this.velX;
      this.currentPaperY += this.velY;
      
      // Update previous touch position
      this.prevTouchX = this.touchMoveX;
      this.prevTouchY = this.touchMoveY;

      // Apply transform
      paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      
      console.log('Dragging paper:', this.currentPaperX, this.currentPaperY);
    });

    paper.addEventListener('touchend', (e) => {
      e.preventDefault();
      this.holdingPaper = false;
      this.rotating = false;
    });

    // Prevent context menu on long press
    paper.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });

    // Add visual feedback for touch
    paper.addEventListener('touchstart', () => {
      paper.style.transition = 'none';
      paper.style.opacity = '0.8';
    });

    paper.addEventListener('touchend', () => {
      paper.style.transition = 'opacity 0.2s ease';
      paper.style.opacity = '1';
    });
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Check if device supports touch
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  console.log('Touch device detected:', isTouchDevice);
  
  const papers = Array.from(document.querySelectorAll('.paper'));
  
  papers.forEach(paper => {
    const p = new Paper();
    p.init(paper);
  });
});

// Prevent default touch behaviors on the body to avoid page scrolling
document.body.addEventListener('touchmove', (e) => {
  // Only prevent default if touching a paper element
  if (e.target.closest('.paper')) {
    e.preventDefault();
  }
}, { passive: false });
