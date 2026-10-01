export const editorialEase = [0.22, 1, 0.36, 1] as const;
export const motionSettings = { ease: 'power3.out', imageDuration: 1.1, desktop: '(min-width: 1024px) and (hover: hover) and (pointer: fine)' };

// Importing this module on the server never registers a browser plugin.
let runtime: Promise<{ gsap: typeof import('gsap').gsap; ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger }> | undefined;
export function loadScrollMotion() {
  return runtime ??= Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([core, plugin]) => {
    core.gsap.registerPlugin(plugin.ScrollTrigger);
    return { gsap: core.gsap, ScrollTrigger: plugin.ScrollTrigger };
  }).catch(error => { runtime = undefined; throw error; });
}

/** Layout changes, unlike transforms, require new scroll measurements. */
export function refreshMotionLayout() {
  window.dispatchEvent(new Event('velour:layout'));
}
