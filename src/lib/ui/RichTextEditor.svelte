<script lang="ts">
	import { cn } from '$lib/utils';
	import {
		Bold, Italic, Underline, Strikethrough,
		Heading1, Heading2, List, ListOrdered,
		Link2, Quote, Undo, Redo, Code
	} from '@lucide/svelte';
	import type { Component } from 'svelte';

	type Props = {
		value?: string;
		placeholder?: string;
		class?: string;
	};

	let {
		value = $bindable(''),
		placeholder = 'Write something...',
		class: cls
	}: Props = $props();

	let editorEl: HTMLDivElement;
	let isFocused = $state(false);

	// Sync external value → editor (only on init / external set)
	$effect(() => {
		if (editorEl && value !== undefined && !isFocused) {
			const current = editorEl.innerHTML;
			if (current !== value) {
				editorEl.innerHTML = value || '';
			}
		}
	});

	function exec(command: string, val?: string) {
		document.execCommand(command, false, val);
		editorEl?.focus();
		syncValue();
	}

	function setBlock(tag: string) {
		document.execCommand('formatBlock', false, tag);
		editorEl?.focus();
		syncValue();
	}

	function toggleLink() {
		const url = window.prompt('Enter URL:');
		if (url) {
			document.execCommand('createLink', false, url);
			syncValue();
		}
	}

	function syncValue() {
		if (editorEl) value = editorEl.innerHTML;
	}

	function onInput() {
		syncValue();
	}

	function onPaste(e: ClipboardEvent) {
		// Strip formatting on paste → plain text
		e.preventDefault();
		const text = e.clipboardData?.getData('text/plain') ?? '';
		document.execCommand('insertText', false, text);
	}

	interface ToolButton {
		icon: Component;
		action: () => void;
		title: string;
	}

	const tools: ToolButton[][] = [
		[
			{ icon: Bold, action: () => exec('bold'), title: 'Bold' },
			{ icon: Italic, action: () => exec('italic'), title: 'Italic' },
			{ icon: Underline, action: () => exec('underline'), title: 'Underline' },
			{ icon: Strikethrough, action: () => exec('strikeThrough'), title: 'Strikethrough' },
			{ icon: Code, action: () => exec('insertCode' as never, '`'), title: 'Inline Code' },
		],
		[
			{ icon: Heading1, action: () => setBlock('h2'), title: 'Heading 1' },
			{ icon: Heading2, action: () => setBlock('h3'), title: 'Heading 2' },
			{ icon: Quote, action: () => setBlock('blockquote'), title: 'Quote' },
		],
		[
			{ icon: List, action: () => exec('insertUnorderedList'), title: 'Bullet list' },
			{ icon: ListOrdered, action: () => exec('insertOrderedList'), title: 'Numbered list' },
			{ icon: Link2, action: toggleLink, title: 'Insert link' },
		],
		[
			{ icon: Undo, action: () => exec('undo'), title: 'Undo' },
			{ icon: Redo, action: () => exec('redo'), title: 'Redo' },
		]
	];
</script>

<div class={cn('rounded-lg border border-input bg-background overflow-hidden', cls)}>
	<!-- Toolbar -->
	<div class="flex flex-wrap items-center gap-0.5 border-b border-border bg-muted/30 px-2 py-1.5">
		{#each tools as group, gi}
			{#if gi > 0}
				<div class="w-px h-5 bg-border mx-1"></div>
			{/if}
			{#each group as tool}
				<button
					type="button"
					class="flex h-7 w-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
					title={tool.title}
					onclick={tool.action}
				>
					<tool.icon class="h-4 w-4" />
				</button>
			{/each}
		{/each}
	</div>

	<!-- Editor area -->
	<div class="relative">
		<div
			bind:this={editorEl}
			contenteditable="true"
			class="prose prose-sm dark:prose-invert max-w-none min-h-[120px] px-4 py-3 text-sm outline-none [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5 [&_blockquote]:border-l-4 [&_blockquote]:border-border [&_blockquote]:pl-3 [&_blockquote]:text-muted-foreground [&_a]:text-primary [&_a]:underline [&_h2]:text-lg [&_h2]:font-bold [&_h2]:mt-3 [&_h2]:mb-1 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-2 [&_h3]:mb-1"
			onfocus={() => (isFocused = true)}
			onblur={() => (isFocused = false)}
			oninput={onInput}
			onpaste={onPaste}
			role="textbox"
			data-placeholder={placeholder}
		></div>
		{#if !value && !isFocused}
			<div class="pointer-events-none absolute top-3 left-4 text-sm text-muted-foreground">
				{placeholder}
			</div>
		{/if}
	</div>
</div>

<style>
	[contenteditable]:empty::before {
		content: attr(data-placeholder);
		color: var(--color-muted-foreground);
		pointer-events: none;
	}
</style>
