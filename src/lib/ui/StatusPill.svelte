<script lang="ts" module>
	import Badge from './Badge.svelte';

	export const STATUS_MAP: Record<string, { label: string; variant: 'success' | 'warning' | 'info' | 'danger' | 'default' | 'primary' }> = {
		Completed: { label: 'Completed', variant: 'success' },
		Processing: { label: 'Processing', variant: 'info' },
		Pending: { label: 'Pending', variant: 'warning' },
		Cancelled: { label: 'Cancelled', variant: 'danger' },
		Shipped: { label: 'Shipped', variant: 'primary' },
		Draft: { label: 'Draft', variant: 'default' },
		Paid: { label: 'Paid', variant: 'success' },
		Unpaid: { label: 'Unpaid', variant: 'warning' },
		Overdue: { label: 'Overdue', variant: 'danger' },
		Active: { label: 'Active', variant: 'success' },
		Inactive: { label: 'Inactive', variant: 'default' }
	};
</script>

<script lang="ts">
	type Props = { status: string };
	let { status }: Props = $props();
	const cfg = $derived(STATUS_MAP[status] ?? { label: status, variant: 'default' as const });
</script>

<Badge variant={cfg.variant}>{cfg.label}</Badge>
