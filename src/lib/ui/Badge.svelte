<script lang="ts" module>
	import { tv, type VariantProps } from 'tailwind-variants';

	export const badgeVariants = tv({
		base: 'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
		variants: {
			variant: {
				default: 'bg-muted text-foreground',
				primary: 'bg-primary/15 text-primary',
				success: 'bg-success/15 text-success',
				warning: 'bg-warning/15 text-warning',
				danger: 'bg-danger/15 text-danger',
				info: 'bg-info/15 text-info',
				outline: 'border border-border bg-transparent text-foreground'
			}
		},
		defaultVariants: { variant: 'default' }
	});

	export type BadgeVariants = VariantProps<typeof badgeVariants>;
</script>

<script lang="ts">
	import { cn } from '$lib/utils';

	type Props = BadgeVariants & {
		class?: string;
		children?: import('svelte').Snippet;
	};

	let { variant, class: cls, children }: Props = $props();
</script>

<span class={cn(badgeVariants({ variant }), cls)}>
	{@render children?.()}
</span>
