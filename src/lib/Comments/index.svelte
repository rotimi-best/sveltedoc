<script>
	import { onMount, afterUpdate } from 'svelte';
	import Delete16 from 'carbon-icons-svelte/lib/Delete16';
	import TextField from '$lib/Form/TextField.svelte';
	import IconButton from '$lib/IconButton/index.svelte';
	import PrimaryButton from '$lib/PrimaryButton/index.svelte';
	import { user } from '../../store/user';

	export let addComment = () => {};
	export let documentComments = [];
	export let deleteComment = () => {};
	export let profileId;
	export let profileIdOfDocOwner;

	let value;
	let lastCommentRef;

	function onKeyDown(e) {
		if (e.key === 'Enter' && value && !!value.length) {
			addComment(value);
			value = null;
		}
	}

	onMount(() => {
		// Scroll to last element
		setTimeout(() => {
			if (lastCommentRef) {
				lastCommentRef.scrollIntoView({
					behavior: 'smooth'
				});
			}
		}, 1000);
	});

	afterUpdate(() => {
		if (lastCommentRef) {
			lastCommentRef.scrollIntoView({
				behavior: 'smooth'
			});
		}
	});
</script>

<section class="root relative shadow-xl h-full rounded-md w-80 border">
	<h2 class="font-bold w-full border border-t-0 border-l-0 border-r-0 border-b m-0 pl-4 py-4">
		Comments {documentComments.length > 0 ? `(${documentComments.length})` : ''}
	</h2>

	<div id="comments" class="comments p-2 overflow-auto">
		{#each documentComments as comment}
			<div class="comment relative">
				<div class="px-2 text-sm mb-2" bind:this={lastCommentRef}>
					<a
						class="pb-2 {profileIdOfDocOwner === comment.profile.id
							? 'text-yellow-700'
							: 'text-gray-500'}"
						href="/profile/{comment.profile.id}"
					>
						{comment.profile.username}
						{profileIdOfDocOwner === comment.profile.id ? '(Author)' : ''}
					</a>
					<p class="">{comment.comment}</p>
				</div>

				{#if profileId === comment.profile.id}
					<div class="delete hidden absolute -top-4 right-0">
						<IconButton onClick={() => deleteComment(comment.id)}>
							<Delete16 class="carbon-icon" />
						</IconButton>
					</div>
				{/if}
			</div>
		{/each}
	</div>
	{#if !$user.isLoggedIn}
		<PrimaryButton
			label="Login to comment"
			className="sticky py-2 px-4 w-full justify-center"
			onClick={() => ($user.openAuthModal = true)}
		/>
	{:else}
		<TextField
			type="text"
			className="sticky b-0"
			inputClassName="p-2"
			bind:value
			placeholder="Your thoughts"
			autoComplete={false}
			{onKeyDown}
		/>
	{/if}
</section>

<style>
	.comments {
		height: 75vh;
	}

	.comment:hover .delete {
		display: block;
	}
</style>
