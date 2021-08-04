import { writable } from 'svelte/store';

export const doc = writable({
	isLoading: true,
	isSaving: false,
	id: null,
	title: null,
	html: null,
	text: null,
	profile: {}
});

export const docs = writable([]);
