<script>
	import TextField from '../Form/TextField.svelte';
	import PrimaryButton from '../PrimaryButton/index.svelte';
	import Modal from '../Modal/index.svelte';
	import { user } from '../../store/user';
	import { supabase } from '../../functions/supabase';

	let email;
	let loading = false;
	let success = false;
	let errors = {};

	async function handleSubmit() {
		if (!email) {
			errors = {
				email: 'Email is required'
			};
			return;
		}

		try {
			loading = true;
			const { error } = await supabase.auth.signIn(
				{ email },
				{
					redirectTo: window.location.origin
				}
			);
			if (error) throw error;
			success = true;
			errors = {};
		} catch (error) {
			errors = {
				email: error.error_description || error.message
			};
		} finally {
			loading = false;
		}
	}

	function handleClose() {
		user.update((_user) => ({
			..._user,
			openAuthModal: false
		}));
		success = false;
		email = null;
		loading = false;
	}
</script>

<svelte:head>
	<title>Join SvelteDoc</title>
</svelte:head>

<Modal modalHeading="Create an account" onClose={handleClose} bind:open={$user.openAuthModal}>
	<form
		on:submit|preventDefault={handleSubmit}
		class="flex items-center justify-between flex-col w-full p-6"
	>
		<img src="/logo_192.png" alt="SvelteDoc logo" height="70" width="70" data-atf="1" />
		<h4 class="text-lg m-0 mt-3">SvelteDoc</h4>
		<div class="my-4 w-full">
			{#if success}
				<p class="text-xl text-center">Please check your email to signin</p>
			{:else}
				<TextField
					label="Your Email"
					bind:value={email}
					type="email"
					autoFocus={true}
					placeholder="Enter your email"
					inputClassName="rounded-md w-full px-2 py-4"
					isDisabled={loading}
					errorMessage={errors.email}
				/>
				<p class="py-3 text-sm">A magic link will be sent to your email, please open the link</p>
			{/if}
		</div>

		{#if !success}
			<div class="my-4 w-full flex justify-end items-center">
				<PrimaryButton
					label={loading ? 'Creating...' : 'Next'}
					type="submit"
					className="py-2 px-4"
					isDisabled={loading}
				/>
			</div>
		{/if}
	</form>
</Modal>
