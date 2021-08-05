<script context="module">
	export const prerender = true;
</script>

<script>
	import { SyncLoader, Chasing } from 'svelte-loading-spinners';
	import { onMount } from 'svelte';
	import DocBox from '$lib/DocBox/index.svelte';
	import Box from '$lib/Box/index.svelte';
	import { docs } from '../store/docs';
	import { supabase } from '../functions/supabase';

	let query = '';
	let timeoutId;
	let isSearching = false;
	let loading = false;

	function onTitleChange(e) {
		isSearching = true;
		query = e.target.value;

		search();
	}

	function search() {
		if (timeoutId) clearTimeout(timeoutId);

		timeoutId = setTimeout(async () => {
			const { data, error } = await supabase
				.from('document')
				.select(
					`
				id,
				title,
				text,
				profile:profile_id ( id, avatar_url, username ),
				comments:documentcomment (count)
			`
				)
				.or(`title.ilike.%${query}%`);
			// Can't search filter by joined table: https://github.com/supabase/supabase/discussions/2234#discussioncomment-975839
			// .or(`username.ilike.%${query}%`, { foreignTable: 'profile' })

			if (error) {
				return alert(error.message);
			}

			isSearching = false;
			docs.set(data);
		}, 1500);
	}

	onMount(async () => {
		loading = true;
		const { data, error } = await supabase
			.from('document')
			.select(
				`
			id,
			title,
			text,
			profile:profile_id ( id, avatar_url, username ),
			comments:documentcomment (count)
		`
			)
			.order('updated_at', { ascending: false });

		if (error) {
			return alert(error.message);
		}
		docs.set(data);
		loading = false;
	});
</script>

<svelte:head>
	<title>Svelte Doc</title>
</svelte:head>

<section class="w-full flex justify-center my-3">
	<input
		type="text"
		placeholder="Find documents by title"
		class="search outline-none rounded-lg p-3 border-2 border-grey-300 hover:shadow-xl "
		value={query}
		on:input={onTitleChange}
	/>
	{#if isSearching}
		<SyncLoader size="50" color="#ff3e00" unit="px" duration="1s" />
	{/if}
</section>

{#if loading}
	<Box>
		<Chasing size="60" color="#ff3e00" unit="px" duration="1s" />
	</Box>
{:else}
	<section class="w-11/12 flex flex-wrap m-auto mb-10">
		{#each $docs as doc}
			<DocBox
				title={doc.title}
				commentsCount={doc.comments[0] ? doc.comments[0].count : null}
				snapshotContent={doc.text}
				profile={doc.profile || {}}
				id={doc.id}
			/>
		{/each}
	</section>
{/if}

<style>
	.search {
		width: 500px;
	}
</style>
