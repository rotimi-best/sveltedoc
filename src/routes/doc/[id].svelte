<script context="module">
	export const prerender = true;

	export const load = ({ page }) => {
		return {
			props: { docId: page.params.id }
		};
	};
</script>

<script>
	import { goto } from '$app/navigation';
	import { onDestroy } from 'svelte';
	import { BarLoader, Chasing } from 'svelte-loading-spinners';
	import DocEditor from '$lib/DocEditor/index.svelte';
	import Box from '$lib/Box/index.svelte';
	import { doc } from '../../store/docs';
	import { profile } from '../../store/profile';
	import { supabase } from '../../functions/supabase';

	export let docId;

	let timeoutId;
	let isOwner = false;

	function autoSave({ title = $doc.title, html = $doc.html, text = $doc.text }) {
		if (!title) {
			return;
		}

		if (timeoutId) clearTimeout(timeoutId);

		doc.update((_doc) => ({
			..._doc,
			isSaving: true,
			html,
			text
		}));

		timeoutId = setTimeout(async () => {
			await supabase
				.from('document')
				.update(
					{ html, title, text },
					{
						returning: 'minimal'
					}
				)
				.match({ id: docId });

			$doc.isSaving = false;
		}, 1500);
	}

	function onTitleChange(e) {
		$doc.title = e.target.value;

		autoSave({ title: $doc.title });
	}

	async function createDoc() {
		const { data, error } = await supabase.from('document').insert({ profile_id: $profile.id });

		if (error || !Array.isArray(data)) {
			alert(error.message || `Couldn't create document`);
			return;
		}

		goto(`/doc/${data[0].id}`);
	}

	async function getDocument() {
		const { data, error } = await supabase
			.from('document')
			.select(
				`
			id,
			title,
			html,
			text,
			profile:profile_id ( id, username )
		`
			)
			.eq('id', docId)
			.single();
		if (error || !data) {
			alert(error.message || `Couldn't create document`);
			return;
		}

		// gotten document
		doc.update((_doc) => ({
			..._doc,
			isLoading: false,
			...data
		}));
	}

	onDestroy(() => {
		$doc.isLoading = true;
	});

	$: {
		isOwner = $doc.profile ? $doc.profile.id === $profile.id : false;
	}

	$: {
		if (docId === 'new') {
			createDoc();
		} else if (docId) {
			getDocument();
		}
	}
</script>

<svelte:head>
	<title>{$doc.title || 'New Document'}</title>
</svelte:head>

<section class="root flex justify-center flex-col m-2">
	{#if $doc.isLoading}
		<Box>
			<Chasing size="60" color="#ff3e00" unit="px" duration="1s" />
		</Box>
	{:else}
		<div class="title flex items-center justify-between">
			<input
				type="text"
				value={$doc.title}
				on:input={onTitleChange}
				class="text-xl p-2 w-11/12 rounded-md hover:border focus:border-grey-300 outline-none"
			/>
			{#if $doc.isSaving}
				<div class="flex items-center flex-col">
					<BarLoader size="20" color="#ff3e00" unit="px" duration="2s" />
					<p class="ml-2 italic">Autosaving...</p>
				</div>
			{/if}
		</div>
		<h6 class="ml-2 text-gray-500 text-sm">
			Written by
			<a class="text-blue-700" href="/profile/{$doc.profile.id}">
				{$doc.profile.username}
			</a>
		</h6>
		<DocEditor {autoSave} content={$doc.html} disable={!isOwner} />
	{/if}
</section>

<style>
	.root {
		width: 800px;
		margin: 0 auto;
	}
</style>
