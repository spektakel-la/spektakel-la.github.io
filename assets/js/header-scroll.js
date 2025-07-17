/**
 * Hide/show header on scroll
 */
(function() {
  let lastScrollTop = 0;
  let scrollThreshold = 10; // Minimum scroll distance to trigger hide/show
  let header = null;

  function initHeaderScroll() {
    header = document.querySelector('.site-header');
    if (!header) return;

    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  function handleScroll() {
    if (!header) return;

    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Don't do anything if we haven't scrolled enough
    if (Math.abs(scrollTop - lastScrollTop) < scrollThreshold) {
      return;
    }

    if (scrollTop > lastScrollTop && scrollTop > 100) {
      // Scrolling down & past the header height - hide header
      header.classList.add('header-hidden');
    } else {
      // Scrolling up - show header
      header.classList.remove('header-hidden');
    }

    lastScrollTop = scrollTop;
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeaderScroll);
  } else {
    initHeaderScroll();
  }
})();
