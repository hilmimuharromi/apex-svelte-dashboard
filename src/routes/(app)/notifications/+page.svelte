<script lang="ts">
	import { Card, Avatar, Badge, Button, Switch } from '$lib/ui';
	import { Bell, MessageSquare, Package, AlertCircle, CheckCircle, GitPullRequest, Users as UsersIcon, Settings as SettingsIcon } from '@lucide/svelte';
	import type { Component } from 'svelte';

	type NotifType = 'mention' | 'order' | 'alert' | 'success' | 'pr' | 'team';
	type Notif = {
		id: string;
		type: NotifType;
		actor?: { name: string; initials: string };
		title: string;
		description: string;
		time: string;
		read: boolean;
	};

	const ICON_MAP: Record<NotifType, Component> = {
		mention: MessageSquare, order: Package, alert: AlertCircle,
		success: CheckCircle, pr: GitPullRequest, team: UsersIcon
	};
	const COLOR_MAP: Record<NotifType, string> = {
		mention: 'bg-primary/15 text-primary', order: 'bg-info/15 text-info',
		alert: 'bg-danger/15 text-danger', success: 'bg-success/15 text-success',
		pr: 'bg-warning/15 text-warning', team: 'bg-primary/15 text-primary'
	};

	let notifs = $state<Notif[]>([
		{ id: 'n1', type: 'mention', actor: { name: 'Emma Wilson', initials: 'EW' }, title: 'Emma mentioned you', description: 'in "Q3 dashboard review" — Can you take a look at the segmentation?', time: '5 min ago', read: false },
		{ id: 'n2', type: 'order', title: 'New order received', description: 'ORD-7891 · $299 · Pro Dashboard License', time: '12 min ago', read: false },
		{ id: 'n3', type: 'alert', title: 'Database usage at 92%', description: 'Consider upgrading your plan or archiving old data', time: '1 hour ago', read: false },
		{ id: 'n4', type: 'pr', actor: { name: 'James Chen', initials: 'JC' }, title: 'James opened a pull request', description: 'feat(auth): implement magic link login · +342 −18', time: '2 hours ago', read: true },
		{ id: 'n5', type: 'success', title: 'Deployment successful', description: 'apex-dashboard v2.1.3 deployed to production', time: '3 hours ago', read: true },
		{ id: 'n6', type: 'team', actor: { name: 'Sofia Garcia', initials: 'SG' }, title: 'Sofia joined the team', description: 'Welcome Sofia to the Design team', time: 'Yesterday', read: true },
		{ id: 'n7', type: 'order', title: 'Order shipped', description: 'ORD-7889 · Enterprise License · tracking #TRK-9021', time: 'Yesterday', read: true },
		{ id: 'n8', type: 'mention', actor: { name: 'David Kim', initials: 'DK' }, title: 'David replied to your comment', description: 'in "Mobile navigation z-index" — Great catch, fixed in main.', time: 'Yesterday', read: true },
		{ id: 'n9', type: 'alert', title: 'Failed webhook delivery', description: 'stripe.charge.succeeded to https://api.apex.dev/hooks failed 3 times', time: '2 days ago', read: true }
	]);

	let filter = $state<'all' | 'unread'>('all');
	const displayed = $derived(filter === 'unread' ? notifs.filter((n) => !n.read) : notifs);
	const unreadCount = $derived(notifs.filter((n) => !n.read).length);

	function markAllRead() { notifs = notifs.map((n) => ({ ...n, read: true })); }
	function toggleRead(id: string) { notifs = notifs.map((n) => n.id === id ? { ...n, read: !n.read } : n); }

	// preferences
	let prefs = $state({
		mentions: true, orders: true, alerts: true, prs: false, team: true, marketing: false
	});
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-semibold tracking-tight flex items-center gap-3">
				Notifications
				{#if unreadCount > 0}
					<Badge variant="primary">{unreadCount} unread</Badge>
				{/if}
			</h1>
			<p class="mt-1 text-sm text-muted-foreground">Alerts, mentions, and activity</p>
		</div>
		{#if unreadCount > 0}
			<Button variant="outline" onclick={markAllRead}>Mark all as read</Button>
		{/if}
	</div>

	<div class="grid gap-6 lg:grid-cols-[1fr_320px]">
		<Card class="p-0 overflow-hidden">
			<div class="flex gap-1 p-3 border-b border-border">
				<button
					class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors {filter === 'all' ? 'bg-muted' : 'hover:bg-muted/50 text-muted-foreground'}"
					onclick={() => (filter = 'all')}
				>All ({notifs.length})</button>
				<button
					class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors {filter === 'unread' ? 'bg-muted' : 'hover:bg-muted/50 text-muted-foreground'}"
					onclick={() => (filter = 'unread')}
				>Unread ({unreadCount})</button>
			</div>

			{#if displayed.length === 0}
				<div class="py-16 text-center">
					<div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-3">
						<Bell class="h-6 w-6 text-muted-foreground" />
					</div>
					<p class="font-medium">You're all caught up</p>
					<p class="text-sm text-muted-foreground mt-1">No unread notifications</p>
				</div>
			{:else}
				<div class="divide-y divide-border">
					{#each displayed as n (n.id)}
						{@const Icon = ICON_MAP[n.type]}
						<button
							onclick={() => toggleRead(n.id)}
							class="w-full text-left px-5 py-4 hover:bg-muted/30 transition-colors flex items-start gap-3 {!n.read ? 'bg-primary/[0.03]' : ''}"
						>
							{#if n.actor}
								<Avatar initials={n.actor.initials} size="sm" />
							{:else}
								<div class="h-8 w-8 rounded-full flex items-center justify-center {COLOR_MAP[n.type]}">
									<Icon class="h-4 w-4" />
								</div>
							{/if}
							<div class="flex-1 min-w-0">
								<div class="flex items-start justify-between gap-3">
									<p class="text-sm {!n.read ? 'font-semibold' : 'font-medium'}">{n.title}</p>
									<span class="text-xs text-muted-foreground shrink-0">{n.time}</span>
								</div>
								<p class="text-sm text-muted-foreground mt-0.5">{n.description}</p>
							</div>
							{#if !n.read}
								<span class="mt-2 h-2 w-2 rounded-full bg-primary shrink-0"></span>
							{/if}
						</button>
					{/each}
				</div>
			{/if}
		</Card>

		<Card>
			<div class="flex items-center gap-2">
				<SettingsIcon class="h-4 w-4 text-muted-foreground" />
				<h3 class="font-semibold">Preferences</h3>
			</div>
			<p class="text-xs text-muted-foreground mt-1">Choose what you want to be notified about</p>

			<div class="mt-5 space-y-4">
				{#each [
					{ key: 'mentions', label: 'Mentions', desc: 'When someone tags you in a comment' },
					{ key: 'orders', label: 'Orders', desc: 'New orders, refunds, shipping updates' },
					{ key: 'alerts', label: 'System alerts', desc: 'Usage limits, failed deliveries, errors' },
					{ key: 'prs', label: 'Pull requests', desc: 'Reviews, merges, and CI status' },
					{ key: 'team', label: 'Team activity', desc: 'New members, role changes' },
					{ key: 'marketing', label: 'Product updates', desc: 'Release notes and announcements' }
				] as p}
					<label class="flex items-start gap-3 cursor-pointer">
						<Switch bind:checked={prefs[p.key as keyof typeof prefs]} />
						<div class="flex-1 min-w-0">
							<p class="text-sm font-medium">{p.label}</p>
							<p class="text-xs text-muted-foreground">{p.desc}</p>
						</div>
					</label>
				{/each}
			</div>
		</Card>
	</div>
</div>
