import { writable } from 'svelte/store';

export const profile = writable({
	id: null,
	avatar_url: null,
	username: null,
	user_id: ''
});
