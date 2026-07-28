<script lang="ts">
	import { cn } from '$lib/utils';

	type Props = {
		class?: string;
		title?: string;
		description?: string;
		children?: import('svelte').Snippet;
		header?: import('svelte').Snippet;
		footer?: import('svelte').Snippet;
		action?: import('svelte').Snippet;
	};

	let { class: cls, title, description, children, header, footer, action }: Props = $props();
</script>

<div class={cn('rounded-xl border border-border bg-card shadow-sm', cls)}>
	{#if title || description || header || action}
		<div class="flex items-start justify-between gap-4 border-b border-border p-5">
			<div class="min-w-0">
				{#if header}
					{@render header()}
				{:else}
					{#if title}
						<h3 class="text-base font-semibold">{title}</h3>
					{/if}
					{#if description}
						<p class="mt-1 text-sm text-muted-foreground">{description}</p>
					{/if}
				{/if}
			</div>
			{#if action}
				<div class="shrink-0">{@render action()}</div>
			{/if}
		</div>
	{/if}
	<div class="p-5">
		{@render children?.()}
	</div>
	{#if footer}
		<div class="border-t border-border p-5">
			{@render footer()}
		</div>
	{/if}
</div>
