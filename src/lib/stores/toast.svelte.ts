import type { Component } from 'svelte';
export type Toast = { id: string; type: 'success' | 'danger' | 'info'; message: string; description?: string };

class ToastStore {
	toasts = $state<Toast[]>([]);
	add(type: Toast['type'], message: string, description?: string) {
		const id = crypto.randomUUID();
		this.toasts.push({ id, type, message, description });
		setTimeout(() => this.remove(id), 4000);
	}
	remove(id: string) {
		this.toasts = this.toasts.filter(t => t.id !== id);
	}
	success(msg: string, desc?: string) { this.add('success', msg, desc); }
	danger(msg: string, desc?: string) { this.add('danger', msg, desc); }
	info(msg: string, desc?: string) { this.add('info', msg, desc); }
}
export const toast = new ToastStore();
