<script lang="ts">
	import { cn } from '$lib/utils';

	type Slice = { label: string; value: number; color?: string };
	type Props = {
		data: Slice[];
		size?: number;
		centerLabel?: string;
		centerValue?: string;
		class?: string;
	};

	let { data, size = 180, centerLabel, centerValue, class: cls }: Props = $props();

	const total = $derived(data.reduce((s, d) => s + d.value, 0) || 1);
	const palette = ['var(--color-primary)', 'var(--color-info)', 'var(--color-warning)', 'var(--color-danger)', 'var(--color-success)'];

	const stroke = 22;
	const r = (size - stroke) / 2;
	const c = 2 * Math.PI * r;

	let offset = 0;
	const segments = $derived.by(() => {
		let acc = 0;
		return data.map((d, i) => {
			const frac = d.value / total;
			const seg = { dash: frac * c, gap: c - frac * c, offset: -acc, color: d.color ?? palette[i % palette.length] };
			acc += frac * c;
			return seg;
		});
	});
</script>

<div class={cn('relative inline-block', cls)} style="width: {size}px; height: {size}px">
	<svg viewBox="0 0 {size} {size}" class="-rotate-90">
		<circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-border)" stroke-width={stroke} />
		{#each segments as s}
			<circle
				cx={size / 2}
				cy={size / 2}
				r={r}
				fill="none"
				stroke={s.color}
				stroke-width={stroke}
				stroke-dasharray="{s.dash} {s.gap}"
				stroke-dashoffset={s.offset}
			/>
		{/each}
	</svg>
	{#if centerLabel || centerValue}
		<div class="absolute inset-0 flex flex-col items-center justify-center leading-tight">
			{#if centerValue}
				<span class="text-lg font-semibold tabular">{centerValue}</span>
			{/if}
			{#if centerLabel}
				<span class="text-xs text-muted-foreground">{centerLabel}</span>
			{/if}
		</div>
	{/if}
</div>
