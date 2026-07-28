<script lang="ts">
	import { page } from '$app/state';
	import { cn } from '$lib/utils';
	import { APP_CONFIG } from '$lib/config';
	import { sidebar } from '$lib/stores/sidebar.svelte';
	import { LogOut, PanelLeftClose, PanelRightClose } from '@lucide/svelte';
	import { Modal, Button } from '$lib/ui';
	import { NAV_GROUPS as navItems } from './nav-items';
	
	let currentPath = $derived(page.url.pathname);
	let logoutModal = $state(false);

	function performLogout() {
		logoutModal = false;
		// Normally we'd clear tokens here, routing to login for demo:
		window.location.href = '/login';
	}
</script>

<aside class={cn('sticky top-0 flex h-screen shrink-0 flex-col bg-sidebar text-sidebar-foreground transition-[width] duration-200', sidebar.collapsed ? 'w-[72px]' : 'w-[260px]')}>
	<!-- Logo -->
	<div class="flex h-16 shrink-0 items-center border-b border-sidebar-border px-4 transition-all">
		<a href="/" class="flex items-center gap-3 overflow-hidden" aria-label="Go to dashboard">
			<div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
				{APP_CONFIG.brand.name[0]}
			</div>
			<div class={cn('flex flex-col whitespace-nowrap transition-opacity duration-200', sidebar.collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100')}>
				<span class="font-bold leading-tight tracking-tight">{APP_CONFIG.brand.name}</span>
				<span class="text-[10px] uppercase leading-none tracking-widest text-sidebar-foreground/60">{APP_CONFIG.brand.suffix}</span>
			</div>
		</a>
	</div>

	<!-- Navigation -->
	<div class="flex-1 overflow-y-auto overflow-x-hidden p-3 custom-scrollbar">
		<nav class="space-y-6">
			{#each navItems as section}
				<div>
					{#if !sidebar.collapsed}
						<h3 class="mb-2 px-2 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider whitespace-nowrap transition-opacity duration-200">
							{section.label}
						</h3>
					{/if}
					<ul class="space-y-1">
						{#each section.items as item}
							{@const isActive = currentPath === item.href}
							<li>
								<a
									href={item.href}
									class={cn(
										'group flex items-center rounded-lg px-2 py-2 text-sm font-medium transition-colors',
										isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground',
										sidebar.collapsed ? 'justify-center' : 'gap-3'
									)}
									title={sidebar.collapsed ? item.label : undefined}
								>
									<item.icon class={cn('h-5 w-5 shrink-0 transition-colors', isActive ? 'text-sidebar-accent-foreground' : 'text-sidebar-foreground/50 group-hover:text-sidebar-accent-foreground')} />
									<span class={cn('whitespace-nowrap transition-all duration-200', sidebar.collapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100 block')}>
										{item.label}
									</span>
									{#if item.badge && !sidebar.collapsed}
										<span class="ml-auto inline-flex h-5 items-center justify-center rounded-full bg-primary px-2 text-[10px] font-medium text-primary-foreground">
											{item.badge}
										</span>
									{/if}
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</nav>
	</div>

	<!-- Footer -->
	<div class="border-t border-sidebar-border p-3">
		<ul class="space-y-1">
			<li>
				<button
					class={cn(
						'flex w-full items-center rounded-lg px-2 py-2 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground',
						sidebar.collapsed ? 'justify-center' : 'gap-3'
					)}
					onclick={() => logoutModal = true}
					title={sidebar.collapsed ? 'Log out' : undefined}
				>
					<LogOut class="h-5 w-5 shrink-0 text-sidebar-foreground/50" />
					<span class={cn('whitespace-nowrap transition-all duration-200', sidebar.collapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100 block')}>Log out</span>
				</button>
			</li>
			<li>
				<button
					class={cn(
						'flex w-full items-center rounded-lg px-2 py-2 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground',
						sidebar.collapsed ? 'justify-center' : 'gap-3'
					)}
					onclick={() => sidebar.toggle()}
					title={sidebar.collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
				>
					{#if sidebar.collapsed}
						<PanelLeftClose class="h-5 w-5 shrink-0 text-sidebar-foreground/50" />
					{:else}
						<PanelRightClose class="h-5 w-5 shrink-0 text-sidebar-foreground/50" />
					{/if}
					<span class={cn('whitespace-nowrap transition-all duration-200', sidebar.collapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100 block')}>Collapse sidebar</span>
				</button>
			</li>
		</ul>
	</div>
</aside>

<!-- Logout Confirmation Modal -->
<Modal bind:open={logoutModal} title="Log Out" description="Are you sure you want to log out of your account?">
	<div class="py-2 text-sm text-muted-foreground">
		You will be returned to the login screen and will need to provide your credentials to access the dashboard again.
	</div>
	{#snippet footer()}
		<Button variant="ghost" onclick={() => (logoutModal = false)}>Cancel</Button>
		<Button variant="danger" onclick={performLogout}>Yes, Log out</Button>
	{/snippet}
</Modal>

<style>
	.custom-scrollbar::-webkit-scrollbar { width: 4px; }
	.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
	.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.1); border-radius: 4px; }
	:global(.dark) .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); }
</style>
