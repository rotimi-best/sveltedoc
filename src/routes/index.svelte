<script context="module">
	export const prerender = true;
</script>

<script>
	import { onMount } from 'svelte';
	import DocBox from '$lib/DocBox/index.svelte';
	import { docs } from '../store/docs';
	import { supabase } from '../functions/supabase';

	let query;

	onMount(async () => {
		const { data, error } = await supabase.from('document').select(`
			id,
			title,
			text,
			profile:profile_id ( id, avatar_url, username )
		`);

		if (error) {
			return alert(error.message);
		}
		docs.set(data);
	});
</script>

<svelte:head>
	<title>Svelte Doc</title>
</svelte:head>

<section class="w-full flex justify-center my-3">
	<input
		type="text"
		placeholder="Find documents"
		class="search outline-none rounded-lg p-3 border-2 border-grey-300 hover:shadow-xl "
		bind:value={query}
	/>
</section>

<section class="w-11/12 flex flex-wrap mx-3">
	{#each $docs as doc}
		<DocBox title={doc.title} snapshotContent={doc.text} profile={doc.profile || {}} id={doc.id} />
	{/each}
</section>

<style>
	.search {
		width: 500px;
	}
</style>
