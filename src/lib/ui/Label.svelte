<script lang="ts">
	import type { HTMLLabelAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';

	type Props = HTMLLabelAttributes & { class?: string; children?: import('svelte').Snippet };
	let { class: cls, children, ...rest }: Props = $props();
</script>

<label class={cn('text-sm font-medium leading-none', cls)} {...rest}>
	{@render children?.()}
</label>
