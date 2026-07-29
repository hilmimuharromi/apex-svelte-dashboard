<script lang="ts">
	import { Search, Bell, Sun, Moon, Palette, Plus, CreditCard, User, Settings, LogOut } from '@lucide/svelte';
	import { page } from '$app/state';
	import { Modal, Button, Input, Select, Label, Badge } from '$lib/ui';
	import { toast } from '$lib/stores/toast.svelte';
	import CommandPalette from '$lib/layout/CommandPalette.svelte';
	import { theme } from '$lib/stores/theme.svelte';

	let { onToggleTheme, onOpenCustomizer }: { onToggleTheme: () => void; onOpenCustomizer: () => void } = $props();

	const user = $derived(page.data.user);
	let userMenuOpen = $state(false);

	function initials(name: string) {
		return name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
	}

	function performLogout() {
		const form = document.createElement('form');
		form.method = 'POST';
		form.action = '/logout';
		document.body.appendChild(form);
		form.submit();
	}

	let orderModal = $state(false);
	let paletteOpen = $state(false);

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			paletteOpen = true;
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<header class="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 backdrop-blur px-4 sm:px-6">
	<!-- Search -->
	<button
		class="relative hidden h-9 w-full max-w-sm items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 text-sm text-muted-foreground shadow-sm transition-colors hover:bg-muted md:flex"
		onclick={() => (paletteOpen = true)}
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

		<button
			class="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold hover:bg-primary/20 transition-colors"
			aria-label="User menu"
			onclick={() => (userMenuOpen = !userMenuOpen)}
		>
			{user ? initials(user.name) : '?'}
		</button>
	</div>

	<!-- User dropdown -->
	{#if userMenuOpen}
		<div class="fixed inset-0 z-40" onclick={() => (userMenuOpen = false)} role="button" tabindex="0" aria-label="Close menu"></div>
		<div class="absolute right-4 top-14 z-50 w-64 rounded-xl border border-border bg-background shadow-lg p-2">
			<div class="flex items-center gap-3 px-3 py-2.5 mb-1 border-b border-border">
				<div class="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
					{user ? initials(user.name) : '?'}
				</div>
				<div class="min-w-0">
					<p class="text-sm font-semibold truncate">{user?.name ?? 'Guest'}</p>
					<p class="text-xs text-muted-foreground truncate">{user?.email ?? ''}</p>
				</div>
			</div>
			<a href="/settings" class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors" onclick={() => (userMenuOpen = false)}>
				<Settings class="h-4 w-4 text-muted-foreground" />
				Settings
			</a>
			<button
				class="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
				onclick={performLogout}
			>
				<LogOut class="h-4 w-4" />
				Log out
			</button>
		</div>
	{/if}
</header>

<!-- Command Palette (⌘K) -->
<CommandPalette
	bind:open={paletteOpen}
	onToggleTheme={onToggleTheme}
	onNewOrder={() => (orderModal = true)}
/>

<!-- New Order Modal -->
<Modal bind:open={orderModal} title="Create New Order" description="Draft a manual order for a customer.">
	<div class="space-y-4">
		<div class="space-y-1.5">
			<Label>Customer</Label>
			<Select>
				<option value="">Select a customer...</option>
				<option value="1">Emma Wilson (emma@example.com)</option>
				<option value="2">James Chen (james@example.com)</option>
			</Select>
		</div>
		<div class="space-y-1.5">
			<Label>Product</Label>
			<Select>
				<option value="">Select a product...</option>
				<option value="p1">Sunscreen Anak SPF50+ — Rp89.000</option>
				<option value="p2">Body Lotion pelembab — Rp65.000</option>
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
		<Button
			onclick={() => {
				orderModal = false;
				toast.success('Order created', 'Draft order saved to queue.');
			}}>Create Order</Button
		>
	{/snippet}
</Modal>
