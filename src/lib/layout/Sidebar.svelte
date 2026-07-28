<script lang="ts">
	import { page } from '$app/state';
	import { NAV_GROUPS } from './nav-items';
	import { sidebar } from '$lib/stores/sidebar.svelte';
	import { APP_CONFIG } from '$lib/config';
	import { cn } from '$lib/utils';
	import { LogOut, ChevronLeft } from '@lucide/svelte';

	const collapsed = $derived(sidebar.collapsed);

	function isActive(href: string): boolean {
		if (href === '/') return page.url.pathname === '/';
		return page.url.pathname === href || page.url.pathname.startsWith(href + '/');
	}
</script>

<aside
	class={cn(
		'flex h-screen flex-col bg-sidebar text-sidebar-foreground transition-[width] duration-200',
		collapsed ? 'w-[72px]' : 'w-[260px]'
	)}
>
	<!-- Brand -->
	<div class="flex h-16 items-center gap-2 px-5 border-b border-sidebar-border">
		<div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
			{APP_CONFIG.brand.name[0]}
		</div>
		{#if !collapsed}
			<div class="flex flex-col leading-tight">
				<span class="text-sm font-semibold">{APP_CONFIG.brand.name}</span>
				<span class="text-[10px] font-medium tracking-widest text-sidebar-muted">{APP_CONFIG.brand.suffix}</span>
			</div>
		{/if}
	</div>

	<!-- Nav -->
	<nav class="flex-1 overflow-y-auto py-4 px-3 space-y-6">
		{#each NAV_GROUPS as group}
			<div>
				{#if !collapsed}
					<div class="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-sidebar-muted">
						{group.label}
					</div>
				{:else}
					<div class="mx-3 mb-2 h-px bg-sidebar-border"></div>
				{/if}
				<ul class="space-y-0.5">
					{#each group.items as item}
						{@const active = isActive(item.href)}
						{@const Icon = item.icon}
						<li>
							<a
								href={item.href}
								title={collapsed ? item.label : undefined}
								class={cn(
									'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
									active
										? 'bg-primary text-primary-foreground'
										: 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground',
									collapsed && 'justify-center'
								)}
							>
								<Icon class="h-[18px] w-[18px] shrink-0" />
								{#if !collapsed}
									<span class="flex-1 truncate">{item.label}</span>
									{#if item.badge != null}
										<span
											class={cn(
												'inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold',
												active
													? 'bg-primary-foreground/20 text-primary-foreground'
													: 'bg-sidebar-accent text-sidebar-foreground'
											)}
										>
											{item.badge}
										</span>
									{/if}
								{/if}
							</a>
						</li>
					{/each}
				</ul>
			</div>
		{/each}
	</nav>

	<!-- Footer: user + collapse -->
	<div class="border-t border-sidebar-border p-3 space-y-2">
		<div class={cn('flex items-center gap-3 rounded-lg px-2 py-2', collapsed && 'justify-center')}>
			<div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
				{APP_CONFIG.user.initials}
			</div>
			{#if !collapsed}
				<div class="flex-1 min-w-0">
					<div class="truncate text-sm font-medium">{APP_CONFIG.user.name}</div>
					<div class="truncate text-xs text-sidebar-muted">{APP_CONFIG.user.role}</div>
				</div>
				<button
					class="text-sidebar-muted hover:text-sidebar-foreground p-1"
					title="Log out"
					aria-label="Log out"
				>
					<LogOut class="h-4 w-4" />
				</button>
			{/if}
		</div>

		<button
			onclick={() => sidebar.toggle()}
			class={cn(
				'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors',
				collapsed && 'justify-center'
			)}
		>
			<ChevronLeft class={cn('h-4 w-4 transition-transform', collapsed && 'rotate-180')} />
			{#if !collapsed}<span>Collapse sidebar</span>{/if}
		</button>
	</div>
</aside>
