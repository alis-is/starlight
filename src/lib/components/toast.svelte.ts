export type ToastVariant = 'info' | 'success' | 'warning' | 'error';

export interface ToastOptions {
	variant?: ToastVariant;
	title?: string;
	/** Auto-dismiss after N ms. `0` keeps it until dismissed. Default 4000. */
	duration?: number;
}

export interface ToastItem {
	id: number;
	message: string;
	variant: ToastVariant;
	title?: string;
}

let items = $state<ToastItem[]>([]);
let seq = 0;

/** Reactive accessor — read inside a component to track toast changes. */
export function getToasts(): ToastItem[] {
	return items;
}

export function dismissToast(id: number) {
	items = items.filter((t) => t.id !== id);
}

export function clearToasts() {
	items = [];
}

interface ToastFn {
	(message: string, opts?: ToastOptions): number;
	success: (message: string, opts?: ToastOptions) => number;
	error: (message: string, opts?: ToastOptions) => number;
	warning: (message: string, opts?: ToastOptions) => number;
	info: (message: string, opts?: ToastOptions) => number;
}

function push(message: string, opts: ToastOptions = {}): number {
	const id = ++seq;
	items.push({ id, message, variant: opts.variant ?? 'info', title: opts.title });
	const duration = opts.duration ?? 4000;
	if (duration > 0) setTimeout(() => dismissToast(id), duration);
	return id;
}

export const toast = push as ToastFn;
toast.success = (m, o) => push(m, { ...o, variant: 'success' });
toast.error = (m, o) => push(m, { ...o, variant: 'error' });
toast.warning = (m, o) => push(m, { ...o, variant: 'warning' });
toast.info = (m, o) => push(m, { ...o, variant: 'info' });
