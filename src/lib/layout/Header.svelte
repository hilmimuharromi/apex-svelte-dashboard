<script lang="ts">
	import { Search, Bell, Sun, Moon, Palette, Plus, CreditCard, User, Settings } from '@lucide/svelte';
	import { APP_CONFIG } from '$lib/config';
	import { Modal, Button, Input, Select, Label, Badge } from '$lib/ui';
	import { toast } from '$lib/stores/toast.svelte';

	let { onOpenPalette, onToggleTheme, onOpenCustomizer } = $props<{
		onOpenPalette: () => void;
		onToggleTheme: () => void;
		onOpenCustomizer: () => void;
	}>();

	let orderModal = $state(false);
	let searchModal = $state(false);

	let searchQuery = $state('');

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			searchModal = true;
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<header class="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 backdrop-blur px-4 sm:px-6">
	<!-- Search -->
	<button
		class="relative hidden h-9 w-full max-w-sm items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 text-sm text-muted-foreground shadow-sm transition-colors hover:bg-muted md:flex"
		onclick={() => (searchModal = true)}
	>
		<Search class="h-4 w-4 shrink-0" />
		<span class="flex-1 text-left">Search...</span>
		<kbd class="hidden rounded-md border border-border bg-background px-2 font-sans text-xs font-medium lg:inline-block">⌘K</kbd>
	</button>

	<!-- Actions -->
	<div class="ml-auto flex items-center gap-2 sm:gap-3">
		<Button variant="primary" size="sm" class="hidden sm:flex" onclick={() => (orderModal = true)}>
			<Plus class="h-4 w-4" />
			New Order
		</Button>
		
		<Button variant="ghost" size="icon" aria-label="Toggle theme" onclick={onToggleTheme}>
			<Sun class="h-4 w-4 dark:hidden" />
			<Moon class="hidden h-4 w-4 dark:block" />
		</Button>
		
		<Button variant="ghost" size="icon" aria-label="Customize theme" onclick={onOpenCustomizer}>
			<Palette class="h-4 w-4" />
		</Button>

		<Button variant="ghost" size="icon" class="relative" aria-label="Notifications">
			<Bell class="h-4 w-4" />
			<span class="absolute right-2.5 top-2.5 flex h-2 w-2 rounded-full bg-danger ring-2 ring-background"></span>
		</Button>

		<button class="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold hover:bg-primary/20 transition-colors" aria-label="User menu">
			{APP_CONFIG.brand.name[0]}S
		</button>
	</div>
</header>

<!-- Search Modal -->
<Modal bind:open={searchModal} maxWidth="xl">
	<div class="relative -m-5 border-b border-border mb-0">
		<Search class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
		<input
			type="text"
			placeholder="Type a command or search..."
			bind:value={searchQuery}
			class="w-full h-14 bg-transparent pl-12 pr-4 border-none focus:outline-none focus:ring-0 text-lg"
			autofocus
		/>
	</div>
	
	<div class="pt-5 pb-2 -mx-2 space-y-1">
		<p class="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Suggestions</p>
		<a href="/calendar" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors text-sm" onclick={() => searchModal = false}>
			<div class="h-8 w-8 rounded bg-muted flex items-center justify-center"><Search class="h-4 w-4 text-muted-foreground" /></div>
			<div class="flex-1 font-medium">Sprint planning</div>
			<Badge variant="outline" class="text-[10px]">Event</Badge>
		</a>
		<a href="/settings" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors text-sm" onclick={() => searchModal = false}>
			<div class="h-8 w-8 rounded bg-muted flex items-center justify-center"><Settings class="h-4 w-4 text-muted-foreground" /></div>
			<div class="flex-1 font-medium">Account Settings</div>
			<Badge variant="outline" class="text-[10px]">Page</Badge>
		</a>
		<a href="/customers" class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors text-sm" onclick={() => searchModal = false}>
			<div class="h-8 w-8 rounded bg-muted flex items-center justify-center"><User class="h-4 w-4 text-muted-foreground" /></div>
			<div class="flex-1 font-medium">Manage Customers</div>
			<Badge variant="outline" class="text-[10px]">Page</Badge>
		</a>
	</div>
</Modal>

<!-- New Order Modal -->
<Modal bind:open={orderModal} title="Create New Order" description="Draft a manual order for a customer.">
	<div class="space-y-4">
		<div class="space-y-1.5">
			<Label>Customer</Label>
			<Select>
				<option value="">Select a customer...</option>
				<option value="1">Acme Corp (Emma Wilson)</option>
				<option value="2">Globex Inc (James Chen)</option>
			</Select>
		</div>
		<div class="space-y-1.5">
			<Label>Product / Service</Label>
			<Select>
				<option value="">Select a product...</option>
				<option value="p1">Dashboard Pro License ($99/mo)</option>
				<option value="p2">Enterprise Support Retainer ($1,499)</option>
			</Select>
		</div>
		<div class="grid grid-cols-2 gap-4">
			<div class="space-y-1.5">
				<Label>Quantity</Label>
				<Input type="number" value="1" min="1" />
			</div>
			<div class="space-y-1.5">
				<Label>Discount (%)</Label>
				<Input type="number" value="0" min="0" max="100" />
			</div>
		</div>
	</div>
	{#snippet footer()}
		<Button variant="ghost" onclick={() => (orderModal = false)}>Cancel</Button>
		<Button onclick={() => { orderModal = false; toast.success('Order created', 'Draft order saved to queue.'); }}>Create Order</Button>
	{/snippet}
</Modal>
