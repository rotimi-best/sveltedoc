<script>
	import ArrowUp16 from 'carbon-icons-svelte/lib/ArrowUp16';
	import Chip from '../Chip/index.svelte';

	export let value = 0;

	function upVote() {
		value = value + 1;
	}
</script>

<div class="vote border-none cursor-pointer" on:click={upVote}>
	{#if $$slots.icon}
		<slot name="icon" />
	{:else}
		<ArrowUp16 />
	{/if}
	<!-- <Chip {value} /> -->
	<span class="ml-2 text-gray-500">{value}</span>
</div>

<style>
	.vote {
		display: flex;
		align-items: center;
		min-width: 25px;
		width: 25px;
		justify-content: center;
		margin-right: 10px;
	}
</style>
