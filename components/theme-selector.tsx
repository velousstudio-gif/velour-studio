'use client';

import { useSyncExternalStore } from 'react';
import { Moon, Sun } from 'lucide-react';
import { themes } from '@/lib/theme';
import { getTheme, getServerTheme, setTheme, subscribeTheme } from '@/lib/theme-store';

export function ThemeSelector({ placement }: { placement: 'header' | 'menu' }) {
  // The hydration render matches SSR. The pre-paint script handles appearance;
  // React then reads the current DOM snapshot and updates only the control state.
  const theme = useSyncExternalStore(subscribeTheme, getTheme, getServerTheme);
  return <div className={`theme-selector theme-selector-${placement}`} role="group" aria-label="Tema visual">
    {themes.map(option => <button key={option.id} type="button" data-theme-option={option.id}
      aria-label={option.label} aria-pressed={theme === option.id}
      title={`${option.label} — ${option.description}`} onClick={() => setTheme(option.id)}>
      {option.id === 'light' ? <Sun className="theme-icon" size={12} aria-hidden="true" /> : <Moon className="theme-icon" size={12} aria-hidden="true" />}<span>{option.shortLabel}</span>
    </button>)}
  </div>;
}
