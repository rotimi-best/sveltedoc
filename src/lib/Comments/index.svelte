<script>
	import TextField from '$lib/Form/TextField.svelte';
	import { onMount } from 'svelte';
	const doc_comments = [
		{
			comment:
				'usto nam explicabo illo placeat magni nesciunt quae, a fugiat ratione at ducimus quasi dignissimos? Reiciendis quam iste nihil.',
			profile: {
				username: 'Elon musk',
				id: '839534034355'
			}
		},
		{
			comment:
				'Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa, voluptatum perspiciatis i',
			profile: {
				username: 'Traversy Media',
				id: '839534034355'
			}
		},
		{
			comment: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cu',
			profile: {
				username: 'rotimi-best',
				id: '839534034355'
			}
		},
		{
			comment:
				'usto nam explicabo illo placeat magni nesciunt quae, a fugiat ratione at ducimus quasi dignissimos? Reiciendis quam iste nihil.',
			profile: {
				username: 'Elon musk',
				id: '839534034355'
			}
		},
		{
			comment:
				'Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa, voluptatum perspiciatis i',
			profile: {
				username: 'Traversy Media',
				id: '839534034355'
			}
		},
		{
			comment: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cu',
			profile: {
				username: 'rotimi-best',
				id: '839534034355'
			}
		},
		{
			comment:
				'usto nam explicabo illo placeat magni nesciunt quae, a fugiat ratione at ducimus quasi dignissimos? Reiciendis quam iste nihil.',
			profile: {
				username: 'Elon musk',
				id: '839534034355'
			}
		},
		{
			comment:
				'Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa, voluptatum perspiciatis i',
			profile: {
				username: 'Traversy Media',
				id: '839534034355'
			}
		},
		{
			comment: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cu',
			profile: {
				username: 'rotimi-best',
				id: '839534034355'
			}
		},
		{
			comment:
				'usto nam explicabo illo placeat magni nesciunt quae, a fugiat ratione at ducimus quasi dignissimos? Reiciendis quam iste nihil.',
			profile: {
				username: 'Elon musk',
				id: '839534034355'
			}
		},
		{
			comment:
				'Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa, voluptatum perspiciatis i',
			profile: {
				username: 'Traversy Media',
				id: '839534034355'
			}
		},
		{
			comment: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cu',
			profile: {
				username: 'rotimi-best',
				id: '839534034355'
			}
		}
	];

	let value;
	let lastCommentRef;

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
		Comments
	</h2>
	<div id="comments" class="comments p-2 overflow-auto">
		{#each doc_comments as comment}
			<div class="px-2 text-sm mb-2" bind:this={lastCommentRef}>
				<a class="pb-2 text-gray-500" href="/profile/{comment.profile.id}">
					{comment.profile.username}
				</a>
				<p class="">{comment.comment}</p>
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
	/>
</section>

<style>
	.comments {
		height: 65vh;
	}
</style>
