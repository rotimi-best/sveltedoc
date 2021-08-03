<script>
	import { notes, changeIsActive, deleteNote } from '../../store/notes';
	import DeleteButton from '../Delete/index.svelte';
</script>

<div class="w-3/6 border-r border-gray-300 h-full">
	{#each $notes as note, index}
		<div class="item relative">
			<button
				class="font-bold text-left p-3 border-t-0 border-r-0 border-l-0 border-b w-full {note.isActive &&
					'bg-blue-100'}"
				on:click={() => changeIsActive(index)}
			>
				{note.title}
			</button>
			<button
				class="hidden absolute top-0 right-0 px-2 bg-red-400 text-white font-bold"
				on:click={() => deleteNote(index)}
			>
				x
			</button>
		</div>
	{/each}
</div>

<style>
	.item:hover button {
		display: block;
	}
</style>
