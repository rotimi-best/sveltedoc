<script>
	import { onMount } from 'svelte';
	import { settings } from './constants';

	export let autoSave;
	export let content;
	export let disable;

	let quill = null;
	let container = null;

	onMount(async () => {
		const { default: Quill } = await import('quill');

		quill = new Quill(container, settings);

		if (content) {
			quill.setContents(JSON.parse(content));
		} else {
			quill.setText('');
		}

		if (disable) {
			quill.disable(disable);
		}

		quill.on('text-change', function () {
			// quill.root.innerHTML

			autoSave({ html: JSON.stringify(quill.getContents()), text: quill.getText(0, 500) });
		});
	});
</script>

<div class="editor-container p-2 w-full {disable && 'disable'}">
	<div bind:this={container} />
</div>

<style>
	.disable:hover {
		cursor: not-allowed;
	}
	.editor-container {
		width: 800px;
		height: 70vh;
	}
</style>
