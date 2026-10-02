/** Public appearance settings only. Shared by the head bootstrap and React store. */
export const THEME_STORAGE_KEY = 'velour-theme';
export const SYSTEM_THEME_QUERY = '(prefers-color-scheme: dark)';
export const DEFAULT_THEME = 'light';
export const themes = [
  { id: 'light', label: 'Velour Light', shortLabel: 'Light', description: 'Crema, blanco, negro y dorado' },
  { id: 'dark', label: 'Velour Dark', shortLabel: 'Dark', description: 'Negro, charcoal, blanco y dorado' },
] as const;
export type Theme = typeof themes[number]['id'];

export function normalizeTheme(value: unknown): Theme {
  return value === 'dark' ? 'dark' : DEFAULT_THEME;
}

export function parseThemePreference(value: unknown): Theme | null {
  if (value === 'light' || value === 'dark') return value;
  // Both previous palettes had light backgrounds. Preserve that manual choice.
  if (value === 'default' || value === 'monochrome') return 'light';
  return null;
}

// Runs synchronously in <head>, before body paint. Only allow known values.
// Keep this self-contained: it must not wait for React or a network request.
export const themeInitScript = `(function(){var p=null,t="light";try{p=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});if(p==="default"||p==="monochrome"){p="light";localStorage.setItem(${JSON.stringify(THEME_STORAGE_KEY)},p)}}catch(e){}if(p==="light"||p==="dark"){t=p}else{try{t=window.matchMedia(${JSON.stringify(SYSTEM_THEME_QUERY)}).matches?"dark":"light"}catch(e){}}document.documentElement.setAttribute("data-theme",t)})();`;
