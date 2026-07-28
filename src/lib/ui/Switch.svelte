<script lang="ts">
	import { cn } from '$lib/utils';

	type Props = { checked?: boolean; disabled?: boolean; class?: string; onchange?: (v: boolean) => void };
	let { checked = $bindable(false), disabled = false, class: cls, onchange }: Props = $props();

	function toggle() {
		if (disabled) return;
		checked = !checked;
		onchange?.(checked);
	}
</script>

<button
	type="button"
	aria-label="Toggle"
	role="switch"
	aria-checked={checked}
	{disabled}
	onclick={toggle}
	class={cn(
		'relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors',
		checked ? 'bg-primary' : 'bg-muted',
		disabled && 'opacity-50 cursor-not-allowed',
		cls
	)}
>
	<span
		class={cn(
			'inline-block h-4 w-4 rounded-full bg-white shadow transition-transform',
			checked ? 'translate-x-4' : 'translate-x-0.5'
		)}
	></span>
</button>
