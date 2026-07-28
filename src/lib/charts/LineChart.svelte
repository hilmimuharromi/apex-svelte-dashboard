<script lang="ts">
	import { cn } from '$lib/utils';

	type Point = { x: number; y: number };
	type Props = { data: Point[]; height?: number; class?: string; stroke?: string };
	let { data, height = 240, class: cls, stroke = 'var(--color-primary)' }: Props = $props();

	const w = 600;
	const h = height;
	const pad = 8;
	const maxY = $derived(Math.max(...data.map((d) => d.y), 1));
	const minY = $derived(Math.min(...data.map((d) => d.y), 0));
	const path = $derived.by(() => {
		if (!data.length) return '';
		const stepX = (w - pad * 2) / Math.max(data.length - 1, 1);
		const yRange = maxY - minY || 1;
		return data
			.map((d, i) => {
				const x = pad + i * stepX;
				const y = h - pad - ((d.y - minY) / yRange) * (h - pad * 2);
				return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
			})
			.join(' ');
	});
</script>

<svg viewBox="0 0 {w} {h}" class={cn('w-full', cls)} style="height: {h}px" preserveAspectRatio="none">
	<path d={path} fill="none" stroke={stroke} stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />
</svg>
