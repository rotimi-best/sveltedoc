<script context="module">
	export const load = ({ page }) => {
		return {
			props: { profileId: page.params.id }
		};
	};
</script>

<script>
	// import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { Chasing } from 'svelte-loading-spinners';
	import Search32 from 'carbon-icons-svelte/lib/Search32';
	import CopyFile32 from 'carbon-icons-svelte/lib/CopyFile32';
	import TextField from '$lib/Form/TextField.svelte';
	import Box from '$lib/Box/index.svelte';
	import DocBox from '$lib/DocBox/index.svelte';
	import PrimaryButton from '$lib/PrimaryButton/index.svelte';
	import { supabase } from '../../functions/supabase';
	import { user } from '../../store/user';
	import { profile } from '../../store/profile';

	export let profileId;

	let loading = false;
	let currentProfile = {};
	let isOwner = false;
	let docs = [];

	async function getUserDocs() {
		const { data, error } = await supabase
			.from('document')
			.select(
				`
			id,
			title,
			text,
			profile:profile_id (id, avatar_url, username),
			comments:documentcomment (count)
		`
			)
			.eq('profile_id', profileId);
		if (error) {
			alert(error.message);
			return;
		}
		docs = data;
	}

	async function getProfile(profileId) {
		loading = true;
		// Get user profile

		// Check if user has profile
		let { data: profileData, error, status } = await supabase
			.from('profile')
			.select(`*`)
			.eq('id', profileId)
			.single();

		if (error && !profileData && status === 406 && $user.currentSession) {
			const { id } = $user.currentSession.user;
			// User wasn't found, create profile

			const { data, error } = await supabase.from('profile').insert([{ user_id: id }]);

			// Profile created, go to profile page
			if (!error && data) {
				currentProfile = data;
				await getUserDocs();
			}
		} else if (profileData) {
			// Profile exists, go to profile page
			currentProfile = profileData;
			await getUserDocs();
		}
		console.log(`currentProfile`, currentProfile);

		loading = false;
	}

	async function updateProfile() {
		try {
			loading = true;
			const { id } = $user.currentSession.user;

			const updates = {
				username: currentProfile.username,
				avatar_url: currentProfile.avatar_url,
				updated_at: new Date()
			};

			let { error } = await supabase
				.from('profile')
				.update(updates, {
					returning: 'minimal' // Don't return the value after inserting
				})
				.match({ user_id: id });

			if (error) throw error;
		} catch (error) {
			alert(error.message);
			loading = false;
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		// if (!$user.isLoggedIn && !$user.fetchingUser) {
		// 	goto('/');
		// 	user.update((_user) => ({
		// 		..._user,
		// 		openAuthModal: true
		// 	}));
		// 	return;
		// }
		// if ($user.currentSession) {
		// 	getProfile();
		// }
	});

	$: isOwner = $profile.id === profileId;
	$: {
		getProfile(profileId);
	}
</script>

<svelte:head>
	<title>Profile of {currentProfile.username}</title>
</svelte:head>

<section class="w-11/12 m-3 flex items-start">
	{#if currentProfile.id}
		<div class="w-1/4 flex items-center flex-col">
			<img
				alt={currentProfile.username}
				src={currentProfile.avatar_url}
				height="260"
				width="260"
				class="rounded-full bg-light-blue-100 mb-4"
			/>

			{#if isOwner}
				<TextField
					bind:value={currentProfile.username}
					className="w-60 mb-4"
					inputClassName="rounded-md"
				/>

				<PrimaryButton
					label={loading ? 'Updating...' : 'Update profile'}
					onClick={updateProfile}
					isDisabled={loading}
				/>
			{:else}
				<h3 class="text-xl">{currentProfile.username}</h3>
			{/if}
		</div>

		<div class="flex-grow" />
		<div class="flex-grow flex flex-wrap mx-3">
			{#each docs as doc}
				<DocBox
					title={doc.title}
					snapshotContent={doc.text}
					profile={doc.profile || {}}
					id={doc.id}
					commentsCount={doc.comments[0].count}
				/>
			{:else}
				<Box>
					<div>
						<CopyFile32 />
					</div>
					<h3 class="text-xl">No documents added</h3>
				</Box>
			{/each}
		</div>
	{:else if loading}
		<Box>
			<Chasing size="60" color="#ff3e00" unit="px" duration="1s" />
		</Box>
	{:else}
		<Box>
			<div>
				<Search32 />
			</div>
			<h3 class="text-xxl">Profile not found</h3>
		</Box>
	{/if}
</section>
