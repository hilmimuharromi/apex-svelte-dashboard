<script lang="ts">
	import { cn } from '$lib/utils';

	type Datum = { label: string; value: number };
	type Props = {
		data: Datum[];
		height?: number;
		yFormat?: (v: number) => string;
		class?: string;
	};

	let { data, height = 240, yFormat = (v) => String(v), class: cls }: Props = $props();

	const max = $derived(Math.max(...data.map((d) => d.value), 1));
	const ticks = $derived([0, 0.25, 0.5, 0.75, 1].map((t) => max * t));
</script>

<div class={cn('relative w-full', cls)} style="height: {height}px">
	<!-- y-axis grid + labels -->
	<div class="absolute inset-0 flex flex-col-reverse justify-between pl-12 pb-6 pr-2 pt-2">
		{#each ticks as t}
			<div class="relative flex items-center" style="height: 0">
				<span class="absolute -left-12 w-10 text-right text-[10px] text-muted-foreground tabular">
					{yFormat(t)}
				</span>
				<div class="w-full border-t border-border/50"></div>
			</div>
		{/each}
	</div>
	<!-- bars -->
	<div class="absolute inset-0 flex items-end gap-1 pl-12 pb-6 pr-2 pt-2">
		{#each data as d}
			<div class="flex-1 h-full flex flex-col items-center justify-end gap-1 group">
				<div
					class="w-full rounded-t bg-primary/80 hover:bg-primary transition-colors relative"
					style="height: {(d.value / max) * 100}%"
					title="{d.label}: {yFormat(d.value)}"
				>
					<div
						class="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-medium bg-foreground text-background px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity pointer-events-none tabular"
					>
						{yFormat(d.value)}
					</div>
				</div>
			</div>
		{/each}
	</div>
	<!-- x-axis labels -->
	<div class="absolute inset-x-0 bottom-0 flex gap-1 pl-12 pr-2 h-5">
		{#each data as d}
			<div class="flex-1 text-center text-[10px] text-muted-foreground">{d.label}</div>
		{/each}
	</div>
</div>
