<script lang="ts" module>
	import { tv, type VariantProps } from 'tailwind-variants';

	export const buttonVariants = tv({
		base: 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
		variants: {
			variant: {
				primary: 'bg-primary text-primary-foreground hover:opacity-90',
				secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
				outline: 'border border-border bg-transparent hover:bg-muted text-foreground',
				ghost: 'hover:bg-muted text-foreground',
				danger: 'bg-danger text-white hover:opacity-90',
				link: 'text-primary underline-offset-4 hover:underline'
			},
			size: {
				sm: 'h-8 px-3 text-xs',
				md: 'h-9 px-4',
				lg: 'h-10 px-6',
				icon: 'h-9 w-9'
			}
		},
		defaultVariants: { variant: 'primary', size: 'md' }
	});

	export type ButtonVariants = VariantProps<typeof buttonVariants>;
</script>

<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';

	type Props = HTMLButtonAttributes &
		ButtonVariants & {
			class?: string;
			children?: import('svelte').Snippet;
		};

	let { variant, size, class: cls, children, ...rest }: Props = $props();
</script>

<button class={cn(buttonVariants({ variant, size }), cls)} {...rest}>
	{@render children?.()}
</button>
