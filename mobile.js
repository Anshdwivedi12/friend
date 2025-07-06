// Mobile touch implementation for real mobile devices
console.log('Mobile touch script loaded');

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
  console.log('Touch start detected');
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
  
  console.log('Paper activated:', paper);
}

function handleTouchMove(e) {
  if (!isDragging || !activePaper) return;
  
  console.log('Touch move detected');
  e.preventDefault();
  e.stopPropagation();
  
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
  console.log('Touch end detected');
  e.preventDefault();
  e.stopPropagation();
  
  if (!activePaper) return;
  
  // Reset visual feedback
  activePaper.style.transition = 'opacity 0.2s ease';
  activePaper.style.opacity = '1';
  
  // Reset state
  activePaper = null;
  isDragging = false;
  
  console.log('Paper deactivated');
}

function handleTouchCancel(e) {
  console.log('Touch cancel detected');
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
  console.log('User agent:', navigator.userAgent);
  
  // Get all paper elements
  const papers = document.querySelectorAll('.paper');
  console.log('Found papers:', papers.length);
  
  if (papers.length === 0) {
    console.error('No paper elements found!');
    return;
  }
  
  // Add touch event listeners to each paper
  papers.forEach((paper, index) => {
    console.log(`Adding touch listeners to paper ${index + 1}`);
    
    // Remove any existing listeners
    paper.removeEventListener('touchstart', handleTouchStart);
    paper.removeEventListener('touchmove', handleTouchMove);
    paper.removeEventListener('touchend', handleTouchEnd);
    paper.removeEventListener('touchcancel', handleTouchCancel);
    
    // Add new listeners with proper options
    paper.addEventListener('touchstart', handleTouchStart, { 
      passive: false, 
      capture: false 
    });
    paper.addEventListener('touchmove', handleTouchMove, { 
      passive: false, 
      capture: false 
    });
    paper.addEventListener('touchend', handleTouchEnd, { 
      passive: false, 
      capture: false 
    });
    paper.addEventListener('touchcancel', handleTouchCancel, { 
      passive: false, 
      capture: false 
    });
    
    // Prevent context menu
    paper.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
    
    // Set initial transform if not already set
    if (!paper.style.transform) {
      paper.style.transform = `rotateZ(${Math.random() * 30 - 15}deg)`;
    }
    
    // Add a test click handler to verify the element is clickable
    paper.addEventListener('click', (e) => {
      console.log('Paper clicked!', e);
    });
    
    console.log(`Paper ${index + 1} listeners added successfully`);
  });
  
  // Prevent body scrolling when touching papers
  document.body.addEventListener('touchmove', (e) => {
    if (e.target.closest('.paper')) {
      console.log('Preventing body scroll for paper touch');
      e.preventDefault();
    }
  }, { passive: false });
  
  // Add global touch event listeners as backup
  document.addEventListener('touchstart', (e) => {
    if (e.target.closest('.paper')) {
      console.log('Global touch start on paper');
    }
  }, { passive: false });
  
  console.log('Mobile touch initialization complete!');
}

// Multiple initialization strategies
function initWithRetry() {
  try {
    initializePapers();
  } catch (error) {
    console.error('Error initializing papers:', error);
    // Retry after a short delay
    setTimeout(initWithRetry, 100);
  }
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initWithRetry);
} else {
  // DOM is already ready
  initWithRetry();
}

// Also initialize on window load as backup
window.addEventListener('load', () => {
  console.log('Window loaded, ensuring papers are initialized...');
  setTimeout(initWithRetry, 100);
});

// Additional initialization after a longer delay as final backup
setTimeout(() => {
  console.log('Final initialization attempt...');
  initWithRetry();
}, 1000);

// Log when script is fully loaded
console.log('Mobile touch script initialization complete');
