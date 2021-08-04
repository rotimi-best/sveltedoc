<script>
	// import ArrowUp16 from 'carbon-icons-svelte/lib/ArrowUp16';
	import AddComment24 from 'carbon-icons-svelte/lib/AddComment24';
	import Vote from '../Vote/index.svelte';

	export let id;
	export let title;
	export let snapshotContent;
	export let profile = {};
	export let commentsCount = 0;
</script>

<a class="root" href="/doc/{id}">
	<div class="border border-grey-300 rounded-md m-3 hover:border-yellow-600">
		<div class="doc-box-snippet flex items-center p-3">
			<p class="text-xs text-gray-600">
				{snapshotContent || 'No content added'}
			</p>
		</div>
		<div class="border border-r-0 border-l-0 border-b-0 border-t border-grey-300 p-3">
			<h3 class="overflow-ellipsis" {title}>
				{title}
			</h3>
			<div class="w-full flex justify-between items-center p-1">
				<!-- <Vote value={1}>
					<slot:component slot="icon">
						<ArrowUp16 />
					</slot:component>
				</Vote> -->
				<a class="text-gray-500 underline text-sm" href="/profile/{profile.id}">
					{profile.username}
				</a>

				<Vote value={commentsCount}>
					<slot:component slot="icon">
						<AddComment24 />
					</slot:component>
				</Vote>
			</div>
		</div>
	</div>
</a>

<style>
	h3 {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.root {
		width: 263px;
		max-width: 263px;
	}
	.doc-box-snippet {
		height: 263px;
	}
</style>
