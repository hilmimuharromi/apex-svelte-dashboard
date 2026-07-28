<script lang="ts">
	import { Loader2 } from '@lucide/svelte';
	import { cn } from '$lib/utils';
	type Props = { class?: string };
	let { class: cls }: Props = $props();
</script>

<Loader2 class={cn('h-4 w-4 animate-spin', cls)} />
