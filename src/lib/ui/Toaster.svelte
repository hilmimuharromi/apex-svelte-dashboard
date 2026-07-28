<script lang="ts">
	import { toast } from '$lib/stores/toast.svelte';
	import { CheckCircle, AlertCircle, Info, X } from '@lucide/svelte';
	import { fly } from 'svelte/transition';

	const ICON = { success: CheckCircle, danger: AlertCircle, info: Info };
	const COLOR = { success: 'text-success', danger: 'text-danger', info: 'text-info' };
</script>

<div class="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
	{#each toast.toasts as t (t.id)}
		{@const I = ICON[t.type]}
		<div
			transition:fly={{ y: 20, duration: 200 }}
			class="bg-background border border-border shadow-lg rounded-xl p-4 min-w-[300px] max-w-sm pointer-events-auto flex items-start gap-3"
		>
			<I class="h-5 w-5 {COLOR[t.type]} shrink-0 mt-0.5" />
			<div class="flex-1 min-w-0">
				<p class="text-sm font-semibold leading-tight">{t.message}</p>
				{#if t.description}<p class="text-sm text-muted-foreground mt-0.5 leading-snug">{t.description}</p>{/if}
			</div>
			<button onclick={() => toast.remove(t.id)} class="text-muted-foreground hover:bg-muted p-1 rounded-md transition-colors"><X class="h-4 w-4"/></button>
		</div>
	{/each}
</div>
