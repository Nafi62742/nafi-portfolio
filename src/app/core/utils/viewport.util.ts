/**
 * Intersection Observer utility for scroll-reveal animations.
 * Adds the 'revealed' class to elements with the 'reveal' class when they enter the viewport.
 */
export function initRevealObserver(): void {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target); // fire once
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
  );

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}

/**
 * Re-run observer (call after new components mount or route changes).
 */
export function observeNewElements(container: HTMLElement): void {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  container.querySelectorAll('.reveal:not(.revealed)').forEach((el) => observer.observe(el));
}
