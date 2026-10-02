'use client';

import { DEFAULT_THEME, normalizeTheme, parseThemePreference, SYSTEM_THEME_QUERY, THEME_STORAGE_KEY, type Theme } from './theme';

const listeners = new Set<() => void>();
let manualTheme: Theme | null | undefined;
let transitionTimer: ReturnType<typeof setTimeout> | undefined;
let disconnect: (() => void) | undefined;

export const getServerTheme = () => DEFAULT_THEME;
export const getTheme = () => normalizeTheme(document.documentElement.dataset.theme);

function readPreference() {
  try { return parseThemePreference(window.localStorage.getItem(THEME_STORAGE_KEY)); }
  catch { return null; }
}

function applyTheme(theme: Theme, animate = true) {
  const root = document.documentElement;
  if (getTheme() === theme) return;
  clearTimeout(transitionTimer);
  if (animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    root.setAttribute('data-theme-transition', '');
    transitionTimer = setTimeout(() => root.removeAttribute('data-theme-transition'), 400);
  } else root.removeAttribute('data-theme-transition');
  root.dataset.theme = theme;
}

function notify() { listeners.forEach(listener => listener()); }

export function setTheme(theme: Theme) {
  manualTheme = normalizeTheme(theme);
  applyTheme(manualTheme);
  // Keep the manual choice in memory even if the browser refuses storage.
  try { window.localStorage.setItem(THEME_STORAGE_KEY, manualTheme); } catch { /* The current session still works. */ }
  notify();
}

function connect() {
  const system = window.matchMedia(SYSTEM_THEME_QUERY);
  const systemTheme = (): Theme => system.matches ? 'dark' : 'light';
  if (manualTheme === undefined) manualTheme = readPreference();
  applyTheme(manualTheme ?? systemTheme(), false);

  const syncSystem = () => {
    if (manualTheme !== null) return;
    applyTheme(systemTheme());
    notify();
  };
  const syncStorage = (event: StorageEvent) => {
    if (event.key !== THEME_STORAGE_KEY && event.key !== null) return;
    // Removing the saved choice resumes automatic system selection.
    manualTheme = parseThemePreference(event.newValue);
    applyTheme(manualTheme ?? systemTheme());
    notify();
  };
  system.addEventListener('change', syncSystem);
  window.addEventListener('storage', syncStorage);
  return () => {
    system.removeEventListener('change', syncSystem);
    window.removeEventListener('storage', syncStorage);
  };
}

export function subscribeTheme(listener: () => void) {
  listeners.add(listener);
  // Header and mobile selectors share one pair of native listeners.
  if (listeners.size === 1) disconnect = connect();
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) { disconnect?.(); disconnect = undefined; }
  };
}
