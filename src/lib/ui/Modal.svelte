<script lang="ts">
	import { X } from '@lucide/svelte';
	import { fade, scale } from 'svelte/transition';
	import type { Snippet } from 'svelte';

	type Props = {
		open: boolean;
		title?: string;
		description?: string;
		maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
		children: Snippet;
		footer?: Snippet;
	};

	let {
		open = $bindable(false),
		title,
		description,
		maxWidth = 'lg',
		children,
		footer
	}: Props = $props();

	function close() {
		open = false;
	}

	const MAX_WIDTHS = {
		sm: 'max-w-sm',
		md: 'max-w-md',
		lg: 'max-w-lg',
		xl: 'max-w-xl',
		'2xl': 'max-w-2xl'
	};
</script>

<svelte:window onkeydown={(e) => e.key === 'Escape' && open && close()} />

{#if open}
	<!-- Backdrop -->
	<div
		class="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
		transition:fade={{ duration: 150 }}
		aria-hidden="true"
		onclick={close}
	></div>

	<!-- Modal -->
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
		<div
			class="bg-background border border-border shadow-lg rounded-xl w-full {MAX_WIDTHS[maxWidth]} overflow-hidden flex flex-col max-h-[90vh] pointer-events-auto"
			transition:scale={{ duration: 150, start: 0.95 }}
			role="dialog"
			aria-modal="true"
		>
			<!-- Header -->
			{#if title}
				<div class="flex items-start justify-between p-5 border-b border-border">
					<div>
						<h2 class="text-lg font-semibold tracking-tight">{title}</h2>
						{#if description}
							<p class="text-sm text-muted-foreground mt-1">{description}</p>
						{/if}
					</div>
					<button
						onclick={close}
						class="p-1 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
						aria-label="Close"
					>
						<X class="h-4 w-4" />
					</button>
				</div>
			{/if}

			<!-- Body -->
			<div class="p-5 overflow-y-auto">
				{@render children()}
			</div>

			<!-- Footer -->
			{#if footer}
				<div class="p-5 border-t border-border bg-muted/30 flex items-center justify-end gap-2">
					{@render footer()}
				</div>
			{/if}
		</div>
	</div>
{/if}
