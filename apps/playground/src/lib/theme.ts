export const THEMES = ['dark', 'light', 'black', 'candy'] as const;
export type Theme = (typeof THEMES)[number];

const KEY = 'theme';

export function loadTheme(): Theme {
	const stored = typeof localStorage !== 'undefined' ? localStorage.getItem(KEY) : null;
	return (THEMES as readonly string[]).includes(stored ?? '') ? (stored as Theme) : 'dark';
}

export function applyTheme(theme: Theme) {
	// Themes are `:root.<name>` selectors, so the class must be the only one.
	document.documentElement.className = theme;
	try {
		localStorage.setItem(KEY, theme);
	} catch {
		// ignore (private mode etc.)
	}
}
