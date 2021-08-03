<script>
	import { onMount } from 'svelte';
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
		let res = { error: null, data: null };
		const isTokenExpired = Date.now() >= localStorageData.expiresAt * 1000;

		if (isTokenExpired) {
			res = await updateToken(localStorageData.currentSession.refresh_token);
		} else {
			res = await getUser(localStorageData.currentSession.access_token);
		}

		console.log(`res`, res);
		if (res.error && !res.data) {
			return console.error('Error getting user profile from supabase', res.error);
		}

		// Get profile
		let profileResponse = await supabase
			.from('profile')
			.select(`*`)
			.eq('user_id', res.data.id)
			.single();
		console.log(`profileResponse`, profileResponse);
		if (!profileResponse.error && profileResponse.data) {
			profile.set(profileResponse.data);
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

		console.log(`profile`, $profile);
		console.log(`user`, $user);
	}

	onMount(() => {
		if ($user.currentSession) {
			console.log('Dont get data again bro');
			return;
		}

		$user.fetchingUser = true;
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
	});
</script>

<Authenticate />

<main>
	<Navigation />
	<slot />
</main>

<footer class="w-full">
	<p>Built with love by <a target="_blank" href="https://twitter.com/">rotimi-best</a></p>
</footer>

<style>
	main {
		margin-bottom: 60px;
	}

	footer {
		position: fixed;
		bottom: 0;
		display: flex;
		border-top: 1px solid rgb(209, 213, 219);
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 20px;
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
			padding: 20px 0;
		}
	}
</style>
