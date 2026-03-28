// Theme Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
  const themeToggle = document.getElementById('themeToggle');
  const htmlElement = document.documentElement;
  
  // Check for saved theme preference or default to dark
  const savedTheme = localStorage.getItem('theme') || 'dark';
  htmlElement.setAttribute('data-theme', savedTheme);
  
  // Toggle theme on button click
  themeToggle.addEventListener('click', function() {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Add a subtle animation
    htmlElement.style.transition = 'background-color 0.3s ease, color 0.3s ease';
  });
  
  // Smooth scroll for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // Add scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);
  
  // Observe all sections for scroll animations
  document.querySelectorAll('section').forEach(section => {
    section.classList.add('animate-on-scroll');
    observer.observe(section);
  });
  
  // Add active state to navigation based on scroll position
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navigation a');
  
  window.addEventListener('scroll', function() {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollY >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
});
