/**
 * Intersection Observer utility for scroll-reveal animations.
 * Adds the 'revealed' class to elements with the 'reveal' class when they enter the viewport.
 */
export function initRevealObserver(): void {
  const observer: IntersectionObserver = new IntersectionObserver(
    (entries: Array<IntersectionObserverEntry>) => {
      entries.forEach((entry: IntersectionObserverEntry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
  );

  document.querySelectorAll('.reveal').forEach((el: Element) => observer.observe(el));
}

/**
 * Re-attaches the Intersection Observer for newly mounted elements within a container.
 * Call this after new components mount or after route changes.
 *
 * @param container - The parent HTMLElement to search for unobserved .reveal elements
 */
export function observeNewElements(container: HTMLElement): void {
  const observer: IntersectionObserver = new IntersectionObserver(
    (entries: Array<IntersectionObserverEntry>) => {
      entries.forEach((entry: IntersectionObserverEntry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  container.querySelectorAll('.reveal:not(.revealed)').forEach((el: Element) => observer.observe(el));
}
