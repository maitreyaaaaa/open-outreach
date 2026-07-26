import { animate, stagger } from 'animejs';

export function animateCardStagger(selector = '.glass-enterprise-card, .glass-enterprise-panel') {
  try {
    const elements = document.querySelectorAll(selector);
    if (!elements || elements.length === 0) return;

    animate(elements, {
      translateY: [16, 0],
      opacity: [0.3, 1],
      delay: stagger(50, { start: 30 }),
      duration: 500,
      ease: 'outExpo'
    });
  } catch (err) {
    console.warn('Anime stagger skipped:', err);
  }
}

export function animateCounter(targetElement, endVal) {
  if (!targetElement) return;
  try {
    const obj = { count: 0 };
    animate(obj, {
      count: endVal,
      round: 1,
      duration: 800,
      ease: 'outExpo',
      onUpdate: () => {
        if (targetElement) targetElement.innerHTML = obj.count;
      }
    });
  } catch (err) {
    if (targetElement) targetElement.innerHTML = endVal;
  }
}

export function animateSpringPulse(element) {
  if (!element) return;
  try {
    animate(element, {
      scale: [1, 0.96, 1.02, 1],
      duration: 350,
      ease: 'outBack'
    });
  } catch (err) {
    // Fallback
  }
}
