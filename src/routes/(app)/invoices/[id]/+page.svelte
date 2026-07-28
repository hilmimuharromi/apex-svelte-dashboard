<script lang="ts">
	import { page } from '$app/state';
	import { money } from '$lib/utils';
	import { Printer, Download, Send, ArrowLeft } from '@lucide/svelte';
	import { toast } from '$lib/stores/toast.svelte';
	import { Card, Button, Badge } from '$lib/ui';
	import { APP_CONFIG } from '$lib/config';
	import { generateInvoices, type Invoice } from '$lib/data/invoices';

	const ALL = generateInvoices(30);
	const invoice = $derived(ALL.find((v) => v.id === page.params.id));

	const STATUS_VARIANT: Record<Invoice['status'], 'success' | 'warning' | 'danger' | 'default'> = {
		Paid: 'success', Pending: 'warning', Overdue: 'danger', Draft: 'default'
	};

	const subtotal = $derived(invoice?.items.reduce((s, it) => s + it.qty * it.price, 0) ?? 0);
	const tax = $derived(subtotal * 0.1);
	const total = $derived(subtotal + tax);
</script>

{#if !invoice}
	<div class="text-center py-16">
		<h1 class="text-2xl font-semibold">Invoice not found</h1>
		<a href="/invoices" class="mt-4 inline-block text-primary hover:underline">← Back to invoices</a>
	</div>
{:else}
	<div class="space-y-6">
		<div class="flex items-center justify-between print:hidden">
			<a href="/invoices" class="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
				<ArrowLeft class="h-4 w-4" /> Back to invoices
			</a>
			<div class="flex gap-2">
				<Button variant="outline" size="sm" onclick={() => toast.success('Invoice sent', 'The invoice has been emailed to the client.')}><Send class="h-4 w-4" /> Send</Button>
				<Button variant="outline" size="sm" onclick={() => { toast.info('Opening print dialog...'); setTimeout(() => window.print(), 500); }}><Printer class="h-4 w-4" /> Print</Button>
				<Button size="sm" onclick={() => toast.info('Downloading...', 'Invoice PDF is being generated.')}><Download class="h-4 w-4" /> Download PDF</Button>
			</div>
		</div>

		<Card class="max-w-4xl mx-auto">
			<!-- Header -->
			<div class="flex items-start justify-between pb-6 border-b border-border">
				<div>
					<div class="flex items-center gap-2">
						<div class="h-10 w-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">
							{APP_CONFIG.brand.name[0]}
						</div>
						<div>
							<p class="font-semibold">{APP_CONFIG.brand.name}</p>
							<p class="text-xs text-muted-foreground">{APP_CONFIG.brand.suffix}</p>
						</div>
					</div>
					<div class="mt-4 text-sm text-muted-foreground">
						<p>123 Business Ave, Suite 100</p>
						<p>San Francisco, CA 94103</p>
						<p>billing@apex.dev</p>
					</div>
				</div>
				<div class="text-right">
					<h1 class="text-2xl font-bold tracking-tight">INVOICE</h1>
					<p class="mt-1 font-mono text-sm text-muted-foreground">{invoice.number}</p>
					<div class="mt-3"><Badge variant={STATUS_VARIANT[invoice.status]}>{invoice.status}</Badge></div>
				</div>
			</div>

			<!-- Meta -->
			<div class="grid grid-cols-2 md:grid-cols-3 gap-6 py-6 border-b border-border">
				<div>
					<p class="text-xs uppercase tracking-wider text-muted-foreground font-medium">Billed to</p>
					<p class="mt-2 font-semibold">{invoice.client.company}</p>
					<p class="text-sm">{invoice.client.name}</p>
					<p class="text-sm text-muted-foreground">{invoice.client.email}</p>
				</div>
				<div>
					<p class="text-xs uppercase tracking-wider text-muted-foreground font-medium">Issued</p>
					<p class="mt-2 text-sm">{invoice.issued}</p>
					<p class="text-xs uppercase tracking-wider text-muted-foreground font-medium mt-4">Due</p>
					<p class="mt-2 text-sm">{invoice.due}</p>
				</div>
				<div>
					<p class="text-xs uppercase tracking-wider text-muted-foreground font-medium">Amount due</p>
					<p class="mt-2 text-3xl font-bold tabular">{money(total)}</p>
				</div>
			</div>

			<!-- Items -->
			<table class="w-full text-sm my-6">
				<thead>
					<tr class="text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
						<th class="py-2 text-left font-medium">Description</th>
						<th class="py-2 text-right font-medium">Qty</th>
						<th class="py-2 text-right font-medium">Price</th>
						<th class="py-2 text-right font-medium">Total</th>
					</tr>
				</thead>
				<tbody>
					{#each invoice.items as item}
						<tr class="border-b border-border">
							<td class="py-3">{item.desc}</td>
							<td class="py-3 text-right tabular">{item.qty}</td>
							<td class="py-3 text-right tabular">{money(item.price)}</td>
							<td class="py-3 text-right tabular font-medium">{money(item.qty * item.price)}</td>
						</tr>
					{/each}
				</tbody>
			</table>

			<!-- Totals -->
			<div class="flex justify-end">
				<div class="w-full max-w-xs space-y-2 text-sm">
					<div class="flex justify-between"><span class="text-muted-foreground">Subtotal</span><span class="tabular">{money(subtotal)}</span></div>
					<div class="flex justify-between"><span class="text-muted-foreground">Tax (10%)</span><span class="tabular">{money(tax)}</span></div>
					<div class="flex justify-between pt-2 border-t border-border font-bold text-base"><span>Total</span><span class="tabular">{money(total)}</span></div>
				</div>
			</div>

			<div class="mt-8 pt-6 border-t border-border text-xs text-muted-foreground text-center">
				Thank you for your business. Payment is due within 30 days.
			</div>
		</Card>
	</div>
{/if}

<style>
	@media print {
		:global(aside), :global(header) { display: none !important; }
		:global(main) { padding: 0 !important; }
	}
</style>
