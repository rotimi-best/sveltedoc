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
		quill.on('text-change', function () {
			// quill.root.innerHTML

			autoSave({ html: JSON.stringify(quill.getContents()), text: quill.getText(0, 500) });
		});
	});

	$: {
		if (quill && quill.setText) {
			if (disable) {
				quill.disable(disable);
			} else {
				quill.enable(true);
			}
		}
	}
</script>

<div class="editor-container p-2 w-full">
	<div bind:this={container} />
</div>

<style>
	.editor-container {
		max-width: 800px;
		height: 70vh;
	}
</style>
