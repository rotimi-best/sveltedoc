<script>
	import { onMount, afterUpdate } from 'svelte';
	import Navigation from '$lib/Navigation/index.svelte';
	import Authenticate from '$lib/Authenticate/index.svelte';
	import { supabase } from '../functions/supabase';
	import { user } from '../store/user';
	import { profile } from '../store/profile';
	import '../app.css';

	async function updateToken(refreshToken) {
		console.log('updating refresh token');

		return await supabase.auth.api.refreshAccessToken(refreshToken);
	}

	async function getUser(accessToken) {
		console.log('getting user');

		return await supabase.auth.api.getUser(accessToken);
	}

	async function setUserInStore(localStorageData) {
		console.log(`setUserInStore $user`, $user);
		let res = { error: null, data: null };
		const isTokenExpired = Date.now() >= localStorageData.expiresAt * 1000;

		if (isTokenExpired) {
			res = await updateToken(localStorageData.currentSession.refresh_token);
		} else {
			res = await getUser(localStorageData.currentSession.access_token);
		}

		if (res.error && !res.data) {
			return console.error('Error getting user profile from supabase', res.error);
		}

		user.update((_user) => ({
			..._user,
			fetchingUser: false,
			isLoggedIn: true,
			...localStorageData,
			currentSession: {
				...localStorageData.currentSession,
				user: res.data
			}
		}));

		// Get profile
		let profileResponse = await supabase
			.from('profile')
			.select(`*`)
			.eq('user_id', res.data.id)
			.single();

		if (!profileResponse.error && profileResponse.data) {
			profile.set(profileResponse.data);
		} else if ($user.currentSession && !profileResponse.data) {
			const { id } = $user.currentSession.user;
			// User wasn't found, create profile

			const { data, error } = await supabase.from('profile').insert([{ user_id: id }]);

			// Profile created
			if (!error && Array.isArray(data)) {
				profile.set(data[0]);
			}
		}
	}

	onMount(() => {
		if ($user.currentSession) {
			console.log('Dont get data again bro');
			return;
		}

		$user.fetchingUser = true;
		setTimeout(() => {
			console.log(`Wait a little for token to be set`);
			const supbaseToken = localStorage.getItem('supabase.auth.token');
			if (!supbaseToken) {
				$user.fetchingUser = false;
				return;
			}

			let localStorageData;

			try {
				localStorageData = JSON.parse(supbaseToken);
			} catch (error) {
				console.error(error);
			}

			if (!localStorageData) {
				$user.fetchingUser = false;
				return;
			}

			setUserInStore(localStorageData);
		}, 1000);
	});
</script>

<Authenticate />

<main>
	<Navigation />
	<slot />
</main>

<footer class="w-full">
	<p>
		Built with love by <a target="_blank" href="https://twitter.com/rotimi_best">rotimi-best</a>
	</p>
</footer>

<style>
	footer {
		position: fixed;
		bottom: 0;
		display: flex;
		border-top: 1px solid rgb(209, 213, 219);
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 5px;
		background: #fff;
	}

	footer a {
		font-weight: bold;
	}

	:global(.primary) {
		background-color: #ff3e00;
	}

	@media (min-width: 480px) {
		footer {
			padding: 5px 0;
		}
	}
</style>
