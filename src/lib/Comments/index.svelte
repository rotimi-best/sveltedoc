<script>
	import Delete24 from 'carbon-icons-svelte/lib/Delete24';
	import TextField from '$lib/Form/TextField.svelte';
	import IconButton from '$lib/IconButton/index.svelte';
	import { onMount } from 'svelte';

	export let addComment = () => {};
	export let documentComments = [];
	export let deleteComment = () => {};
	export let profileId;

	let value;
	let lastCommentRef;

	function onKeyDown(e) {
		if (e.key === 'Enter') {
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
</script>

<section class="root relative shadow-xl h-full rounded-md w-80 border">
	<h2 class="font-bold w-full border border-t-0 border-l-0 border-r-0 border-b m-0 pl-4 py-4">
		Comments {documentComments.length > 0 ? `(${documentComments.length})` : ''}
	</h2>

	<div id="comments" class="comments p-2 overflow-auto">
		{#each documentComments as comment}
			<div class="comment flex justify-between items-center">
				<div class="px-2 text-sm mb-2" bind:this={lastCommentRef}>
					<a class="pb-2 text-gray-500" href="/profile/{comment.profile.id}">
						{comment.profile.username}
					</a>
					<p class="">{comment.comment}</p>
				</div>

				{#if profileId === comment.profile.id}
					<div class="delete hidden">
						<IconButton onClick={() => deleteComment(comment.id)}>
							<Delete24 class="carbon-icon" />
						</IconButton>
					</div>
				{/if}
			</div>
		{/each}
	</div>
	<TextField
		type="text"
		className="sticky b-0"
		inputClassName="p-2"
		bind:value
		placeholder="Your thoughts"
		autoComplete={false}
		{onKeyDown}
	/>
</section>

<style>
	.comments {
		height: 65vh;
	}

	.comment:hover .delete {
		display: block;
	}
</style>
