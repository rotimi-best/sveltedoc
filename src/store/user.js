import { writable } from 'svelte/store';

export const user = writable({
	openAuthModal: false,
	fetchingUser: false,
	isLoggedIn: false,
	currentSession: null,
	expiresAt: 0
});
