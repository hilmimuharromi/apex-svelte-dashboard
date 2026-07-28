<script lang="ts">
	import { Card, Button, Input, Badge, Avatar } from '$lib/ui';
	import { Folder, FileText, Image, Video, Music, Archive, Upload, Grid3x3, List, Search, MoreVertical, Star } from '@lucide/svelte';
	import { toast } from '$lib/stores/toast.svelte';

	type File = {
		id: string;
		name: string;
		type: 'folder' | 'image' | 'doc' | 'video' | 'audio' | 'archive';
		size?: string;
		modified: string;
		owner: { name: string; initials: string };
		starred?: boolean;
		shared?: number;
	};

	const items: File[] = [
		{ id: 'f1', name: 'Design Assets', type: 'folder', modified: 'Today', owner: { name: 'Emma W.', initials: 'EW' }, shared: 5 },
		{ id: 'f2', name: 'Q3 Reports', type: 'folder', modified: 'Yesterday', owner: { name: 'James C.', initials: 'JC' }, starred: true },
		{ id: 'f3', name: 'Marketing', type: 'folder', modified: 'Mon', owner: { name: 'Sofia G.', initials: 'SG' } },
		{ id: 'f4', name: 'Product Screenshots', type: 'folder', modified: 'Fri', owner: { name: 'You', initials: 'AS' }, shared: 2 },
		{ id: 'f5', name: 'hero-banner-v3.png', type: 'image', size: '2.4 MB', modified: '10:24 AM', owner: { name: 'Emma W.', initials: 'EW' } },
		{ id: 'f6', name: 'Product Roadmap Q4.pdf', type: 'doc', size: '1.8 MB', modified: '09:12 AM', owner: { name: 'You', initials: 'AS' }, starred: true },
		{ id: 'f7', name: 'demo-recording.mp4', type: 'video', size: '48.2 MB', modified: 'Yesterday', owner: { name: 'David K.', initials: 'DK' } },
		{ id: 'f8', name: 'brand-guidelines.pdf', type: 'doc', size: '5.1 MB', modified: 'Yesterday', owner: { name: 'Sofia G.', initials: 'SG' }, shared: 8 },
		{ id: 'f9', name: 'podcast-episode-01.mp3', type: 'audio', size: '12.4 MB', modified: 'Mon', owner: { name: 'Nina R.', initials: 'NR' } },
		{ id: 'f10', name: 'assets-v2.zip', type: 'archive', size: '124 MB', modified: 'Sun', owner: { name: 'James C.', initials: 'JC' } },
		{ id: 'f11', name: 'onboarding-flow.png', type: 'image', size: '890 KB', modified: 'Sun', owner: { name: 'Emma W.', initials: 'EW' } },
		{ id: 'f12', name: 'contract-2026.pdf', type: 'doc', size: '340 KB', modified: 'Last week', owner: { name: 'You', initials: 'AS' } }
	];

	const ICON_MAP = { folder: Folder, image: Image, doc: FileText, video: Video, audio: Music, archive: Archive };
	const COLOR_MAP = { folder: 'text-primary', image: 'text-info', doc: 'text-warning', video: 'text-danger', audio: 'text-success', archive: 'text-muted-foreground' };

	let view = $state<'grid' | 'list'>('grid');
	let search = $state('');

	const filtered = $derived(items.filter((f) => !search || f.name.toLowerCase().includes(search.toLowerCase())));
	const folders = $derived(filtered.filter((f) => f.type === 'folder'));
	const files = $derived(filtered.filter((f) => f.type !== 'folder'));
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-semibold tracking-tight">Files</h1>
			<p class="mt-1 text-sm text-muted-foreground">{items.length} items in your workspace</p>
		</div>
		<Button onclick={() => toast.info('Upload', 'Drag files here or click to browse.')}><Upload class="h-4 w-4" /> Upload</Button>
	</div>

	<div class="flex flex-wrap gap-3 items-center">
		<div class="relative flex-1 max-w-sm">
			<Search class="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
			<Input class="pl-8" placeholder="Search files…" bind:value={search} />
		</div>
		<div class="ml-auto flex rounded-lg border border-border p-0.5">
			<button
				class="p-1.5 rounded {view === 'grid' ? 'bg-muted' : 'hover:bg-muted/50'}"
				onclick={() => (view = 'grid')} aria-label="Grid view"
			><Grid3x3 class="h-4 w-4" /></button>
			<button
				class="p-1.5 rounded {view === 'list' ? 'bg-muted' : 'hover:bg-muted/50'}"
				onclick={() => (view = 'list')} aria-label="List view"
			><List class="h-4 w-4" /></button>
		</div>
	</div>

	{#if view === 'grid'}
		{#if folders.length}
			<div>
				<h2 class="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Folders</h2>
				<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
					{#each folders as f (f.id)}
						{@const Icon = ICON_MAP[f.type]}
						<Card class="p-4 hover:border-primary/50 cursor-pointer transition-colors">
							<div class="flex items-start justify-between">
								<Icon class="h-8 w-8 {COLOR_MAP[f.type]}" />
								{#if f.starred}<Star class="h-4 w-4 text-warning fill-warning" />{/if}
							</div>
							<p class="font-medium text-sm mt-3 truncate">{f.name}</p>
							<p class="text-xs text-muted-foreground mt-0.5">{f.modified}</p>
							{#if f.shared}
								<Badge variant="outline" class="mt-2 text-[10px]">Shared with {f.shared}</Badge>
							{/if}
						</Card>
					{/each}
				</div>
			</div>
		{/if}

		{#if files.length}
			<div>
				<h2 class="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Files</h2>
				<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
					{#each files as f (f.id)}
						{@const Icon = ICON_MAP[f.type]}
						<Card class="p-4 hover:border-primary/50 cursor-pointer transition-colors">
							<div class="flex items-start justify-between">
								<Icon class="h-8 w-8 {COLOR_MAP[f.type]}" />
								{#if f.starred}<Star class="h-4 w-4 text-warning fill-warning" />{/if}
							</div>
							<p class="font-medium text-sm mt-3 truncate" title={f.name}>{f.name}</p>
							<p class="text-xs text-muted-foreground mt-0.5">{f.size} · {f.modified}</p>
						</Card>
					{/each}
				</div>
			</div>
		{/if}
	{:else}
		<Card class="p-0 overflow-hidden">
			<table class="w-full text-sm">
				<thead class="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
					<tr>
						<th class="px-5 py-3 text-left font-medium">Name</th>
						<th class="px-5 py-3 text-left font-medium hidden md:table-cell">Owner</th>
						<th class="px-5 py-3 text-left font-medium hidden lg:table-cell">Modified</th>
						<th class="px-5 py-3 text-right font-medium hidden sm:table-cell">Size</th>
						<th class="px-5 py-3"></th>
					</tr>
				</thead>
				<tbody>
					{#each filtered as f (f.id)}
						{@const Icon = ICON_MAP[f.type]}
						<tr class="border-t border-border hover:bg-muted/40 cursor-pointer">
							<td class="px-5 py-3">
								<div class="flex items-center gap-3">
									<Icon class="h-4 w-4 {COLOR_MAP[f.type]}" />
									<span class="font-medium">{f.name}</span>
									{#if f.starred}<Star class="h-3.5 w-3.5 text-warning fill-warning" />{/if}
								</div>
							</td>
							<td class="px-5 py-3 hidden md:table-cell">
								<div class="flex items-center gap-2">
									<Avatar initials={f.owner.initials} size="xs" />
									<span class="text-xs">{f.owner.name}</span>
								</div>
							</td>
							<td class="px-5 py-3 hidden lg:table-cell text-muted-foreground text-xs">{f.modified}</td>
							<td class="px-5 py-3 text-right tabular text-xs text-muted-foreground hidden sm:table-cell">{f.size ?? '—'}</td>
							<td class="px-5 py-3 text-right">
								<button class="text-muted-foreground hover:text-foreground" aria-label="More"><MoreVertical class="h-4 w-4" /></button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</Card>
	{/if}
</div>
