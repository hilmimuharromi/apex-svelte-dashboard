<script lang="ts">
	import { cn } from '$lib/utils';

	type Props = {
		name?: string;
		initials?: string;
		src?: string;
		size?: 'xs' | 'sm' | 'md' | 'lg';
		class?: string;
	};

	let { name, initials, src, size = 'md', class: cls }: Props = $props();

	const sizes = { xs: 'h-6 w-6 text-[10px]', sm: 'h-8 w-8 text-xs', md: 'h-9 w-9 text-sm', lg: 'h-12 w-12 text-base' };

	const label = $derived(
		initials ||
			(name
				? name
						.split(' ')
						.map((p) => p[0])
						.slice(0, 2)
						.join('')
						.toUpperCase()
				: '?')
	);
</script>

<span
	class={cn(
		'inline-flex shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold overflow-hidden',
		sizes[size],
		cls
	)}
>
	{#if src}
		<img {src} alt={name || 'avatar'} class="h-full w-full object-cover" />
	{:else}
		{label}
	{/if}
</span>
