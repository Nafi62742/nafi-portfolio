/**
 * Typing animation utility — cycles through an array of strings with a typewriter effect.
 * Returns a cleanup function to cancel the animation.
 *
 * @param strings - Array of strings to cycle through
 * @param onUpdate - Callback called on every character change with the current text and cursor state
 * @param typingSpeed - Milliseconds per character when typing (default: 80)
 * @param deletingSpeed - Milliseconds per character when deleting (default: 40)
 * @param pauseMs - Milliseconds to pause after completing a word (default: 1800)
 * @returns A cleanup function that cancels the animation when called
 */
export function startTypingAnimation(
  strings: Array<string>,
  onUpdate: (text: string, showCursor: boolean) => void,
  typingSpeed: number   = 80,
  deletingSpeed: number = 40,
  pauseMs: number       = 1800
): () => void {
  let currentIndex: number = 0;
  let currentText: string  = String();
  let isDeleting: boolean   = false;
  let timeoutId: ReturnType<typeof setTimeout>;

  const tick: () => void = (): void => {
    const fullText: string = strings[currentIndex % strings.length];

    if (isDeleting) {
      currentText = fullText.slice(0, currentText.length - 1);
    } else {
      currentText = fullText.slice(0, currentText.length + 1);
    }

    onUpdate(currentText, true);

    let delay: number = isDeleting ? deletingSpeed : typingSpeed;

    if (!isDeleting && currentText === fullText) {
      delay = pauseMs;
      isDeleting = true;
    } else if (isDeleting && currentText.length === 0) {
      isDeleting = false;
      currentIndex++;
      delay = 400;
    }

    timeoutId = setTimeout(tick, delay);
  };

  timeoutId = setTimeout(tick, 600);
  return (): void => clearTimeout(timeoutId);
}

/**
 * Clamps a number between a minimum and maximum value.
 *
 * @param value - The number to clamp
 * @param min - The minimum allowed value
 * @param max - The maximum allowed value
 * @returns The clamped number
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Returns a debounced version of the provided function.
 * The debounced function delays invoking the original until after the specified wait time.
 *
 * @param fn - The function to debounce
 * @param ms - The debounce delay in milliseconds
 * @returns A debounced version of the input function
 */
export function debounce<T extends (...args: Array<unknown>) => void>(fn: T, ms: number): T {
  let id: ReturnType<typeof setTimeout>;
  return ((...args: Array<unknown>): void => {
    clearTimeout(id);
    id = setTimeout(() => fn(...args), ms);
  }) as T;
}
