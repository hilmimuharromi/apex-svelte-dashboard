<script lang="ts">
	import { Card, Avatar, Badge, Button, Input, Select, Checkbox } from '$lib/ui';
	import { UserPlus, Users as UsersIcon, ShieldCheck, UserX, MoreVertical } from '@lucide/svelte';
	import { StatCard } from '$lib/ui';

	type Role = 'Owner' | 'Admin' | 'Editor' | 'Viewer';
	type Status = 'Active' | 'Invited' | 'Suspended';
	type User = {
		id: string;
		name: string;
		email: string;
		initials: string;
		role: Role;
		status: Status;
		team: string;
		lastActive: string;
	};

	const users: User[] = [
		{ id: 'u1', name: 'Aigars Silkalns', email: 'aigars@apex.dev', initials: 'AS', role: 'Owner', status: 'Active', team: 'Leadership', lastActive: '5 min ago' },
		{ id: 'u2', name: 'Emma Wilson', email: 'emma@apex.dev', initials: 'EW', role: 'Admin', status: 'Active', team: 'Product', lastActive: '12 min ago' },
		{ id: 'u3', name: 'James Chen', email: 'james@apex.dev', initials: 'JC', role: 'Admin', status: 'Active', team: 'Engineering', lastActive: '1 hour ago' },
		{ id: 'u4', name: 'Sofia Garcia', email: 'sofia@apex.dev', initials: 'SG', role: 'Editor', status: 'Active', team: 'Design', lastActive: '2 hours ago' },
		{ id: 'u5', name: 'David Kim', email: 'david@apex.dev', initials: 'DK', role: 'Editor', status: 'Active', team: 'Engineering', lastActive: 'Yesterday' },
		{ id: 'u6', name: 'Maria Santos', email: 'maria@apex.dev', initials: 'MS', role: 'Editor', status: 'Active', team: 'Marketing', lastActive: 'Yesterday' },
		{ id: 'u7', name: 'Alex Thompson', email: 'alex@apex.dev', initials: 'AT', role: 'Viewer', status: 'Invited', team: 'Sales', lastActive: 'Never' },
		{ id: 'u8', name: 'Priya Patel', email: 'priya@apex.dev', initials: 'PP', role: 'Editor', status: 'Active', team: 'Engineering', lastActive: '2 days ago' },
		{ id: 'u9', name: 'Nina Rossi', email: 'nina@apex.dev', initials: 'NR', role: 'Viewer', status: 'Suspended', team: 'Support', lastActive: 'Last week' },
		{ id: 'u10', name: 'Yuki Tanaka', email: 'yuki@apex.dev', initials: 'YT', role: 'Editor', status: 'Active', team: 'Design', lastActive: '3 hours ago' },
		{ id: 'u11', name: 'Marcus Brown', email: 'marcus@apex.dev', initials: 'MB', role: 'Viewer', status: 'Active', team: 'Sales', lastActive: '5 days ago' },
		{ id: 'u12', name: 'Liam O\'Brien', email: 'liam@apex.dev', initials: 'LO', role: 'Viewer', status: 'Invited', team: 'Support', lastActive: 'Never' }
	];

	let search = $state('');
	let roleFilter = $state<'All' | Role>('All');
	let statusFilter = $state<'All' | Status>('All');
	let selected = $state<Set<string>>(new Set());

	const filtered = $derived.by(() => {
		let rows = users;
		if (search) {
			const q = search.toLowerCase();
			rows = rows.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.team.toLowerCase().includes(q));
		}
		if (roleFilter !== 'All') rows = rows.filter((u) => u.role === roleFilter);
		if (statusFilter !== 'All') rows = rows.filter((u) => u.status === statusFilter);
		return rows;
	});

	const ROLE_VARIANT: Record<Role, 'warning' | 'primary' | 'info' | 'default'> = {
		Owner: 'warning', Admin: 'primary', Editor: 'info', Viewer: 'default'
	};
	const STATUS_VARIANT: Record<Status, 'success' | 'warning' | 'danger'> = {
		Active: 'success', Invited: 'warning', Suspended: 'danger'
	};

	function toggleSelect(id: string) {
		if (selected.has(id)) selected.delete(id); else selected.add(id);
		selected = new Set(selected);
	}
	function toggleAll() {
		if (selected.size === filtered.length) selected = new Set();
		else selected = new Set(filtered.map((u) => u.id));
	}
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-semibold tracking-tight">Users</h1>
			<p class="mt-1 text-sm text-muted-foreground">Manage team members and permissions</p>
		</div>
		<Button><UserPlus class="h-4 w-4" /> Invite user</Button>
	</div>

	<div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
		<StatCard label="Total members" value={users.length} icon={UsersIcon} />
		<StatCard label="Active" value={users.filter((u) => u.status === 'Active').length} icon={ShieldCheck} />
		<StatCard label="Pending invites" value={users.filter((u) => u.status === 'Invited').length} icon={UserPlus} />
		<StatCard label="Suspended" value={users.filter((u) => u.status === 'Suspended').length} icon={UserX} />
	</div>

	<Card>
		<div class="flex flex-wrap gap-3 mb-5">
			<Input class="max-w-xs" placeholder="Search name, email, team…" bind:value={search} />
			<Select bind:value={roleFilter} class="w-36">
				{#each ['All', 'Owner', 'Admin', 'Editor', 'Viewer'] as r}<option value={r}>{r}</option>{/each}
			</Select>
			<Select bind:value={statusFilter} class="w-36">
				{#each ['All', 'Active', 'Invited', 'Suspended'] as s}<option value={s}>{s}</option>{/each}
			</Select>
			{#if selected.size > 0}
				<div class="ml-auto flex items-center gap-2">
					<span class="text-sm text-muted-foreground">{selected.size} selected</span>
					<Button variant="outline" size="sm">Change role</Button>
					<Button variant="danger" size="sm">Remove</Button>
				</div>
			{:else}
				<span class="ml-auto self-center text-sm text-muted-foreground">{filtered.length} results</span>
			{/if}
		</div>

		<div class="-mx-5 overflow-x-auto">
			<table class="w-full text-sm">
				<thead class="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
					<tr>
						<th class="px-5 py-3 w-8">
							<Checkbox
								checked={filtered.length > 0 && selected.size === filtered.length}
								onchange={toggleAll}
							/>
						</th>
						<th class="px-5 py-3 text-left font-medium">User</th>
						<th class="px-5 py-3 text-left font-medium hidden sm:table-cell">Team</th>
						<th class="px-5 py-3 text-left font-medium">Role</th>
						<th class="px-5 py-3 text-left font-medium">Status</th>
						<th class="px-5 py-3 text-left font-medium hidden lg:table-cell">Last active</th>
						<th class="px-5 py-3 w-8"></th>
					</tr>
				</thead>
				<tbody>
					{#each filtered as u (u.id)}
						<tr class="border-t border-border hover:bg-muted/40">
							<td class="px-5 py-3"><Checkbox checked={selected.has(u.id)} onchange={() => toggleSelect(u.id)} /></td>
							<td class="px-5 py-3">
								<div class="flex items-center gap-2.5">
									<Avatar initials={u.initials} size="sm" />
									<div>
										<p class="font-medium leading-tight">{u.name}</p>
										<p class="text-xs text-muted-foreground">{u.email}</p>
									</div>
								</div>
							</td>
							<td class="px-5 py-3 hidden sm:table-cell">{u.team}</td>
							<td class="px-5 py-3"><Badge variant={ROLE_VARIANT[u.role]}>{u.role}</Badge></td>
							<td class="px-5 py-3"><Badge variant={STATUS_VARIANT[u.status]}>{u.status}</Badge></td>
							<td class="px-5 py-3 hidden lg:table-cell text-xs text-muted-foreground">{u.lastActive}</td>
							<td class="px-5 py-3">
								<button class="text-muted-foreground hover:text-foreground" aria-label="More"><MoreVertical class="h-4 w-4" /></button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</Card>
</div>
