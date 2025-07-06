// Global variables
let highestZ = 1;
let activePaper = null;
let isDragging = false;
let startX = 0;
let startY = 0;
let currentX = 0;
let currentY = 0;

// Touch event handlers
function handleTouchStart(e) {
  e.preventDefault();
  e.stopPropagation();
  
  const touch = e.touches[0];
  const paper = e.currentTarget;
  
  console.log('Touch started on paper!', touch.clientX, touch.clientY);
  
  // Set as active paper
  activePaper = paper;
  isDragging = true;
  
  // Bring to front
  paper.style.zIndex = highestZ++;
  
  // Get initial touch position
  startX = touch.clientX;
  startY = touch.clientY;
  
  // Get current paper position
  const transform = window.getComputedStyle(paper).transform;
  const matrix = new DOMMatrix(transform);
  currentX = matrix.m41;
  currentY = matrix.m42;
  
  // Visual feedback
  paper.style.transition = 'none';
  paper.style.opacity = '0.8';
  paper.style.transform = `translateX(${currentX}px) translateY(${currentY}px) rotateZ(${Math.random() * 30 - 15}deg)`;
}

function handleTouchMove(e) {
  e.preventDefault();
  e.stopPropagation();
  
  if (!isDragging || !activePaper) return;
  
  const touch = e.touches[0];
  
  // Calculate new position
  const deltaX = touch.clientX - startX;
  const deltaY = touch.clientY - startY;
  
  const newX = currentX + deltaX;
  const newY = currentY + deltaY;
  
  // Apply transform
  const rotation = Math.random() * 30 - 15;
  activePaper.style.transform = `translateX(${newX}px) translateY(${newY}px) rotateZ(${rotation}deg)`;
  
  console.log('Dragging paper:', newX, newY);
}

function handleTouchEnd(e) {
  e.preventDefault();
  e.stopPropagation();
  
  if (!activePaper) return;
  
  // Reset visual feedback
  activePaper.style.transition = 'opacity 0.2s ease';
  activePaper.style.opacity = '1';
  
  // Reset state
  activePaper = null;
  isDragging = false;
}

function handleTouchCancel(e) {
  e.preventDefault();
  e.stopPropagation();
  
  if (!activePaper) return;
  
  // Reset visual feedback
  activePaper.style.transition = 'opacity 0.2s ease';
  activePaper.style.opacity = '1';
  
  // Reset state
  activePaper = null;
  isDragging = false;
}

// Initialize when DOM is loaded
function initializePapers() {
  console.log('Initializing mobile touch functionality...');
  
  // Check if device supports touch
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  console.log('Touch device detected:', isTouchDevice);
  
  // Get all paper elements
  const papers = document.querySelectorAll('.paper');
  console.log('Found papers:', papers.length);
  
  // Add touch event listeners to each paper
  papers.forEach((paper, index) => {
    console.log(`Adding touch listeners to paper ${index + 1}`);
    
    // Remove any existing listeners
    paper.removeEventListener('touchstart', handleTouchStart);
    paper.removeEventListener('touchmove', handleTouchMove);
    paper.removeEventListener('touchend', handleTouchEnd);
    paper.removeEventListener('touchcancel', handleTouchCancel);
    
    // Add new listeners
    paper.addEventListener('touchstart', handleTouchStart, { passive: false });
    paper.addEventListener('touchmove', handleTouchMove, { passive: false });
    paper.addEventListener('touchend', handleTouchEnd, { passive: false });
    paper.addEventListener('touchcancel', handleTouchCancel, { passive: false });
    
    // Prevent context menu
    paper.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
    
    // Set initial transform if not already set
    if (!paper.style.transform) {
      paper.style.transform = `rotateZ(${Math.random() * 30 - 15}deg)`;
    }
  });
  
  // Prevent body scrolling when touching papers
  document.body.addEventListener('touchmove', (e) => {
    if (e.target.closest('.paper')) {
      e.preventDefault();
    }
  }, { passive: false });
  
  console.log('Mobile touch initialization complete!');
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePapers);
} else {
  // DOM is already ready
  initializePapers();
}

// Also initialize on window load as backup
window.addEventListener('load', () => {
  console.log('Window loaded, ensuring papers are initialized...');
  setTimeout(initializePapers, 100);
});
