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
	import { onMount, onDestroy } from 'svelte';
	import { BarLoader, Chasing } from 'svelte-loading-spinners';
	import Delete16 from 'carbon-icons-svelte/lib/Delete16';
	import DocEditor from '$lib/DocEditor/index.svelte';
	import Comments from '$lib/Comments/index.svelte';
	import Box from '$lib/Box/index.svelte';
	import { doc } from '../../store/docs';
	import { profile } from '../../store/profile';
	import { documentComments } from '../../store/documentComments';
	import { supabase } from '../../functions/supabase';

	export let docId;

	let dbSubscription;
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

	function setDefaultTitleIfEmpty() {
		if ($doc.title && $doc.title.length) {
			return;
		}

		$doc.title = 'Untitle document';

		autoSave({ title: $doc.title });
	}

	async function createDoc() {
		const { data, error } = await supabase.from('document').insert({ profile_id: $profile.id });

		if (error || !Array.isArray(data)) {
			alert(error.message || `Couldn't create document`);
			return;
		}

		doc.update((doc) => ({
			...doc,
			title: null,
			html: null,
			text: null,
			profile: {}
		}));

		goto(`/doc/${data[0].id}`);
	}

	async function getDocument() {
		const { data, error } = await supabase
			.from('document')
			.select(`id,title,html,text,profile:profile_id (id, username)`)
			.eq('id', docId)
			.single();

		if (error || !data) {
			console.error(error.message || `Couldn't create document`);
			return;
		}

		// gotten document
		doc.update((_doc) => ({
			..._doc,
			isLoading: false,
			...data
		}));

		await getComments();
	}

	async function getComments() {
		const { data } = await supabase
			.from('documentcomment')
			.select(`id,comment,profile:profile_id (id,username)`)
			.eq('document_id', docId);

		documentComments.set(data);
	}

	async function addComment(comment) {
		const documentComment = {
			document_id: docId,
			profile_id: $profile.id,
			comment
		};

		await supabase.from('documentcomment').insert(documentComment);
	}

	async function deleteComment(commentId) {
		await supabase.from('documentcomment').delete().match({ id: commentId });
	}

	async function handleRecordInserted(payload) {
		const { new: insertedComment } = payload;

		const { data } = await supabase
			.from('profile')
			.select('id, username')
			.eq('id', insertedComment.profile_id)
			.single();

		documentComments.update((docs) => [
			...docs,
			{
				...insertedComment,
				profile: data
			}
		]);
	}

	function handleRecordDeleted(payload) {
		documentComments.update((comments) =>
			comments.filter((comment) => comment.id !== payload.old.id)
		);
	}

	async function handleDelete() {
		await supabase.from('document').delete().match({ id: docId });

		goto(`/profile/${$profile.id}`);
	}

	onMount(() => {
		dbSubscription = supabase
			.from('documentcomment')
			.on('INSERT', handleRecordInserted)
			.on('DELETE', handleRecordDeleted)
			.subscribe();
	});

	onDestroy(() => {
		$doc.isLoading = true;
		supabase.removeSubscription(dbSubscription);
	});

	$: isOwner = $doc.profile ? $doc.profile.id === $profile.id : false;

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

<section class="flex flex-col lg:flex-row justify-center mt-2">
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
					disabled={!isOwner}
					class="text-xl p-2 w-11/12 rounded-md border border-grey-300 outline-none"
					on:blur={setDefaultTitleIfEmpty}
				/>
				{#if $doc.isSaving}
					<div class="flex items-center flex-col">
						<BarLoader size="20" color="#ff3e00" unit="px" duration="2s" />
						<p class="ml-2 italic">Autosaving...</p>
					</div>
				{/if}
			</div>
			<div class="flex items-center">
				<h6 class="ml-2 text-gray-500 text-sm">
					Written by
					<a class="text-blue-700" href="/profile/{$doc.profile.id}">
						{$doc.profile.username}
					</a>
				</h6>

				{#if isOwner}
					<span class=" mx-3">|</span>
					<button on:click={handleDelete} class="text-red-500 text-sm flex items-center">
						<Delete16 /> <span class="ml-2">Delete document</span>
					</button>
				{/if}
			</div>
			<DocEditor docId={$doc.id} {autoSave} content={$doc.html} disable={!isOwner} />
		{/if}
	</section>

	<Comments
		{addComment}
		documentComments={$documentComments}
		{deleteComment}
		profileId={$profile.id}
		profileIdOfDocOwner={$doc.profile.id}
	/>
</section>

<style>
	.root {
		max-width: 800px;
		width: 95%;
	}
</style>
