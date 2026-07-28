<script lang="ts">
	import { cn } from '$lib/utils';

	type Props = {
		label?: string;
		value: number; // 0..100
		description?: string;
		color?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
		class?: string;
	};

	let { label, value, description, color = 'primary', class: cls }: Props = $props();
	const clamped = $derived(Math.max(0, Math.min(100, value)));
	const colorMap = {
		primary: 'bg-primary',
		success: 'bg-success',
		warning: 'bg-warning',
		danger: 'bg-danger',
		info: 'bg-info'
	};
</script>

<div class={cn('space-y-1.5', cls)}>
	{#if label}
		<div class="flex items-center justify-between text-sm">
			<span class="font-medium">{label}</span>
			<span class="tabular text-muted-foreground">{clamped}%</span>
		</div>
	{/if}
	<div class="h-2 w-full rounded-full bg-muted overflow-hidden">
		<div class={cn('h-full rounded-full transition-all', colorMap[color])} style="width: {clamped}%"></div>
	</div>
	{#if description}
		<p class="text-xs text-muted-foreground">{description}</p>
	{/if}
</div>
