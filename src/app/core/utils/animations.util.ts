/**
 * Typing animation utility — cycles through an array of strings.
 * Returns a cleanup function to cancel the animation.
 */
export function startTypingAnimation(
  strings: string[],
  onUpdate: (text: string, showCursor: boolean) => void,
  typingSpeed   = 80,
  deletingSpeed = 40,
  pauseMs       = 1800
): () => void {
  let currentIndex = 0;
  let currentText  = '';
  let isDeleting   = false;
  let timeoutId: ReturnType<typeof setTimeout>;

  const tick = () => {
    const fullText = strings[currentIndex % strings.length];

    if (isDeleting) {
      currentText = fullText.slice(0, currentText.length - 1);
    } else {
      currentText = fullText.slice(0, currentText.length + 1);
    }

    onUpdate(currentText, true);

    let delay = isDeleting ? deletingSpeed : typingSpeed;

    if (!isDeleting && currentText === fullText) {
      delay = pauseMs;
      isDeleting = true;
    } else if (isDeleting && currentText === '') {
      isDeleting = false;
      currentIndex++;
      delay = 400;
    }

    timeoutId = setTimeout(tick, delay);
  };

  timeoutId = setTimeout(tick, 600);
  return () => clearTimeout(timeoutId);
}

/**
 * Clamp a number between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Debounce a function call.
 */
export function debounce<T extends (...args: any[]) => void>(fn: T, ms: number): T {
  let id: ReturnType<typeof setTimeout>;
  return ((...args: any[]) => {
    clearTimeout(id);
    id = setTimeout(() => fn(...args), ms);
  }) as T;
}
