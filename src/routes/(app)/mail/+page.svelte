<script lang="ts">
	import { Card, Button, Input, Avatar, Badge, Modal, Textarea } from '$lib/ui';
	import { toast } from '$lib/stores/toast.svelte';
	let composeModal = $state(false);
	import { Inbox, Send, FileText, Star, Trash, Search, Reply, Forward, Archive } from '@lucide/svelte';

	type Email = {
		id: string;
		from: { name: string; email: string; initials: string };
		subject: string;
		preview: string;
		body: string;
		date: string;
		read: boolean;
		starred: boolean;
		folder: 'inbox' | 'sent' | 'drafts' | 'starred' | 'trash';
		labels?: string[];
	};

	const emails: Email[] = [
		{ id: 'm1', from: { name: 'Emma Wilson', email: 'emma@acme.co', initials: 'EW' }, subject: 'Q3 dashboard review — need your input', preview: 'Hi team, I\'ve compiled the Q3 metrics and would love your thoughts on the new customer segmentation…', body: 'Hi team,\n\nI\'ve compiled the Q3 metrics and would love your thoughts on the new customer segmentation approach. Attached the deck and a shared doc for comments.\n\nKey highlights:\n• MRR up 23% QoQ\n• Churn down to 2.1%\n• NPS at 68\n\nLet\'s sync Thursday.\n\nBest,\nEmma', date: '10:24 AM', read: false, starred: true, folder: 'inbox', labels: ['Work', 'Priority'] },
		{ id: 'm2', from: { name: 'GitHub', email: 'noreply@github.com', initials: 'GH' }, subject: '[apex-svelte-dashboard] PR #42 merged', preview: 'Your pull request has been merged into main.', body: 'Pull request #42 "Add dark mode support" was merged by @miromi.\n\nView changes: https://github.com/…', date: '09:12 AM', read: true, starred: false, folder: 'inbox' },
		{ id: 'm3', from: { name: 'Sofia Garcia', email: 'sofia@design.co', initials: 'SG' }, subject: 'Icon set updates', preview: 'I\'ve pushed the new icons to Figma. Take a look when you have a chance.', body: 'Hey! Pushed the new icon set to Figma. 42 new icons following our updated grid.', date: 'Yesterday', read: true, starred: false, folder: 'inbox', labels: ['Design'] },
		{ id: 'm4', from: { name: 'James Chen', email: 'james@globex.io', initials: 'JC' }, subject: 'Contract renewal', preview: 'Following up on our conversation last week regarding the renewal terms…', body: 'Following up on our conversation last week regarding the renewal terms. We\'re happy to proceed with the 3-year deal at the discussed rate.', date: 'Yesterday', read: false, starred: false, folder: 'inbox', labels: ['Sales'] },
		{ id: 'm5', from: { name: 'David Kim', email: 'david@wayne.co', initials: 'DK' }, subject: 'Bug in mobile navigation', preview: 'Found a z-index issue on iOS Safari when the drawer is open…', body: 'Found a z-index issue on iOS Safari when the drawer is open. Reproducible on iPhone 14+, iOS 17+.', date: 'Mon', read: true, starred: true, folder: 'inbox', labels: ['Bug'] },
		{ id: 'm6', from: { name: 'Nina Rossi', email: 'nina@piedpiper.io', initials: 'NR' }, subject: 'Weekly report — Week 30', preview: 'Weekly metrics attached. Notable: search conversion up 12%.', body: 'Weekly metrics attached. Notable: search conversion up 12%, avg session duration up 8%.', date: 'Mon', read: true, starred: false, folder: 'inbox' }
	];

	const folders = [
		{ id: 'inbox' as const, label: 'Inbox', icon: Inbox, count: 4 },
		{ id: 'starred' as const, label: 'Starred', icon: Star, count: 2 },
		{ id: 'sent' as const, label: 'Sent', icon: Send, count: 0 },
		{ id: 'drafts' as const, label: 'Drafts', icon: FileText, count: 3 },
		{ id: 'trash' as const, label: 'Trash', icon: Trash, count: 0 }
	];

	let activeFolder = $state<Email['folder']>('inbox');
	let selectedId = $state<string>('m1');
	let search = $state('');

	const filtered = $derived(
		emails
			.filter((e) => (activeFolder === 'starred' ? e.starred : e.folder === activeFolder))
			.filter((e) => !search || e.subject.toLowerCase().includes(search.toLowerCase()) || e.from.name.toLowerCase().includes(search.toLowerCase()))
	);

	const selected = $derived(emails.find((e) => e.id === selectedId));
</script>

<div class="space-y-4">
	<h1 class="text-2xl font-semibold tracking-tight">Mail</h1>

	<Card class="p-0 overflow-hidden">
		<!-- Compose Modal -->
	<Modal bind:open={composeModal} title="New Message">
		<div class="space-y-4">
			<Input placeholder="To" />
			<Input placeholder="Subject" />
			<Textarea placeholder="Write your message here..." class="h-32" />
		</div>
		{#snippet footer()}
			<Button variant="ghost" onclick={() => (composeModal = false)}>Discard</Button>
			<Button onclick={() => { composeModal = false; toast.success('Message sent', 'Your email has been sent.'); }}>Send Message</Button>
		{/snippet}
	</Modal>

	<div class="grid lg:grid-cols-[220px_320px_1fr] h-[calc(100vh-13rem)] divide-x divide-border">
			<!-- Folders -->
			<div class="p-4 space-y-1">
				<Button class="w-full mb-3" onclick={() => (composeModal = true)}>Compose</Button>
				{#each folders as f}
					<button
						class="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left transition-colors {activeFolder === f.id ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted'}"
						onclick={() => (activeFolder = f.id)}
					>
						<f.icon class="h-4 w-4" />
						<span class="flex-1">{f.label}</span>
						{#if f.count > 0}<span class="text-xs text-muted-foreground">{f.count}</span>{/if}
					</button>
				{/each}
			</div>

			<!-- Email list -->
			<div class="flex flex-col overflow-hidden">
				<div class="p-3 border-b border-border">
					<div class="relative">
						<Search class="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<Input class="pl-8" placeholder="Search mail…" bind:value={search} />
					</div>
				</div>
				<div class="flex-1 overflow-y-auto">
					{#each filtered as email (email.id)}
						<button
							class="w-full text-left p-3 border-b border-border transition-colors {selectedId === email.id ? 'bg-primary/5' : 'hover:bg-muted/50'} {!email.read ? 'font-semibold' : ''}"
							onclick={() => (selectedId = email.id)}
						>
							<div class="flex items-start gap-2.5">
								<Avatar initials={email.from.initials} size="sm" />
								<div class="min-w-0 flex-1">
									<div class="flex items-baseline justify-between gap-2">
										<span class="text-sm truncate">{email.from.name}</span>
										<span class="text-xs text-muted-foreground shrink-0">{email.date}</span>
									</div>
									<p class="text-sm truncate">{email.subject}</p>
									<p class="text-xs text-muted-foreground truncate mt-0.5 font-normal">{email.preview}</p>
									{#if email.labels}
										<div class="flex gap-1 mt-1.5">
											{#each email.labels as l}<Badge variant="outline" class="text-[10px]">{l}</Badge>{/each}
										</div>
									{/if}
								</div>
							</div>
						</button>
					{/each}
				</div>
			</div>

			<!-- Preview -->
			<div class="flex flex-col overflow-hidden">
				{#if selected}
					<div class="p-5 border-b border-border">
						<div class="flex items-start justify-between gap-4">
							<div>
								<h2 class="text-lg font-semibold">{selected.subject}</h2>
								<div class="mt-2 flex items-center gap-2 text-sm">
									<Avatar initials={selected.from.initials} size="sm" />
									<div>
										<p class="font-medium">{selected.from.name}</p>
										<p class="text-xs text-muted-foreground">{selected.from.email}</p>
									</div>
								</div>
							</div>
							<div class="flex gap-1">
								<Button variant="ghost" size="icon" aria-label="Reply"><Reply class="h-4 w-4" /></Button>
						<Button variant="ghost" size="icon" aria-label="Star" onclick={() => toast.info('Starred', 'Email added to starred.')}>⭐</Button>
								<Button variant="ghost" size="icon" aria-label="Forward"><Forward class="h-4 w-4" /></Button>
								<Button variant="ghost" size="icon" aria-label="Archive"><Archive class="h-4 w-4" /></Button>
							</div>
						</div>
					</div>
					<div class="flex-1 p-5 overflow-y-auto whitespace-pre-wrap text-sm leading-relaxed">
						{selected.body}
					</div>
				{:else}
					<div class="flex-1 flex items-center justify-center text-muted-foreground text-sm">Select an email</div>
				{/if}
			</div>
		</div>
	</Card>
</div>
