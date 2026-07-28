<script lang="ts">
	import { Card, Input, Button, Avatar } from '$lib/ui';
	import { Send, Search, Phone, Video, MoreVertical, Paperclip, Smile } from '@lucide/svelte';

	type Message = { id: string; sender: 'me' | 'them'; text: string; time: string };
	type Conversation = {
		id: string;
		user: { name: string; initials: string; status: 'online' | 'away' | 'offline' };
		last: string;
		time: string;
		unread: number;
		messages: Message[];
	};

	const convos: Conversation[] = [
		{
			id: 'c1', user: { name: 'Emma Wilson', initials: 'EW', status: 'online' },
			last: 'Sounds good, let me check.', time: '10:24', unread: 2,
			messages: [
				{ id: '1', sender: 'them', text: 'Hey! Are you around for a quick call?', time: '10:20' },
				{ id: '2', sender: 'me', text: 'Yes, give me 5 min to wrap this up', time: '10:21' },
				{ id: '3', sender: 'them', text: 'Perfect, I\'ll send a link', time: '10:22' },
				{ id: '4', sender: 'them', text: 'Also, did you get a chance to review the Q3 deck?', time: '10:23' },
				{ id: '5', sender: 'them', text: 'Sounds good, let me check.', time: '10:24' }
			]
		},
		{ id: 'c2', user: { name: 'James Chen', initials: 'JC', status: 'online' }, last: 'The contract looks good ✓', time: '09:12', unread: 0, messages: [
			{ id: '1', sender: 'them', text: 'The contract looks good ✓', time: '09:12' }
		]},
		{ id: 'c3', user: { name: 'Sofia Garcia', initials: 'SG', status: 'away' }, last: 'Uploaded the new icons', time: 'Yesterday', unread: 1, messages: [] },
		{ id: 'c4', user: { name: 'David Kim', initials: 'DK', status: 'offline' }, last: 'Thanks for the review!', time: 'Yesterday', unread: 0, messages: [] },
		{ id: 'c5', user: { name: 'Maria Santos', initials: 'MS', status: 'online' }, last: 'Deploy is complete', time: 'Mon', unread: 0, messages: [] },
		{ id: 'c6', user: { name: 'Nina Rossi', initials: 'NR', status: 'offline' }, last: 'See you tomorrow', time: 'Sun', unread: 0, messages: [] }
	];

	let selectedId = $state('c1');
	let draft = $state('');
	let messages = $state(convos[0].messages);

	const selected = $derived(convos.find((c) => c.id === selectedId)!);

	function selectConvo(id: string) {
		selectedId = id;
		messages = convos.find((c) => c.id === id)?.messages ?? [];
	}

	function send() {
		if (!draft.trim()) return;
		messages = [...messages, { id: crypto.randomUUID(), sender: 'me', text: draft, time: 'now' }];
		draft = '';
	}

	const STATUS_DOT = { online: 'bg-success', away: 'bg-warning', offline: 'bg-muted-foreground/40' };
</script>

<div class="space-y-4">
	<h1 class="text-2xl font-semibold tracking-tight">Chat</h1>

	<Card class="p-0 overflow-hidden">
		<div class="grid lg:grid-cols-[300px_1fr] h-[calc(100vh-13rem)] divide-x divide-border">
			<!-- Conversations -->
			<div class="flex flex-col">
				<div class="p-3 border-b border-border">
					<div class="relative">
						<Search class="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<Input class="pl-8" placeholder="Search…" />
					</div>
				</div>
				<div class="flex-1 overflow-y-auto">
					{#each convos as c (c.id)}
						<button
							class="w-full text-left p-3 border-b border-border transition-colors {selectedId === c.id ? 'bg-primary/5' : 'hover:bg-muted/50'}"
							onclick={() => selectConvo(c.id)}
						>
							<div class="flex items-start gap-2.5">
								<div class="relative">
									<Avatar initials={c.user.initials} size="sm" />
									<span class="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background {STATUS_DOT[c.user.status]}"></span>
								</div>
								<div class="min-w-0 flex-1">
									<div class="flex items-baseline justify-between gap-2">
										<span class="text-sm font-medium truncate">{c.user.name}</span>
										<span class="text-xs text-muted-foreground shrink-0">{c.time}</span>
									</div>
									<p class="text-xs text-muted-foreground truncate">{c.last}</p>
								</div>
								{#if c.unread}
									<span class="h-5 min-w-5 px-1.5 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold flex items-center justify-center">{c.unread}</span>
								{/if}
							</div>
						</button>
					{/each}
				</div>
			</div>

			<!-- Chat -->
			<div class="flex flex-col overflow-hidden">
				<div class="p-3 border-b border-border flex items-center gap-3">
					<div class="relative">
						<Avatar initials={selected.user.initials} size="sm" />
						<span class="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background {STATUS_DOT[selected.user.status]}"></span>
					</div>
					<div class="flex-1">
						<p class="font-medium text-sm">{selected.user.name}</p>
						<p class="text-xs text-muted-foreground capitalize">{selected.user.status}</p>
					</div>
					<Button variant="ghost" size="icon" aria-label="Call"><Phone class="h-4 w-4" /></Button>
					<Button variant="ghost" size="icon" aria-label="Video"><Video class="h-4 w-4" /></Button>
					<Button variant="ghost" size="icon" aria-label="More"><MoreVertical class="h-4 w-4" /></Button>
				</div>

				<div class="flex-1 overflow-y-auto p-5 space-y-3">
					{#each messages as m (m.id)}
						<div class="flex {m.sender === 'me' ? 'justify-end' : 'justify-start'}">
							<div class="max-w-md rounded-2xl px-4 py-2 {m.sender === 'me' ? 'bg-primary text-primary-foreground rounded-br-sm' : 'bg-muted rounded-bl-sm'}">
								<p class="text-sm">{m.text}</p>
								<p class="text-[10px] mt-0.5 opacity-70">{m.time}</p>
							</div>
						</div>
					{/each}
				</div>

				<div class="p-3 border-t border-border">
					<form onsubmit={(e) => { e.preventDefault(); send(); }} class="flex gap-2 items-center">
						<Button variant="ghost" size="icon" type="button" aria-label="Attach"><Paperclip class="h-4 w-4" /></Button>
						<Button variant="ghost" size="icon" type="button" aria-label="Emoji"><Smile class="h-4 w-4" /></Button>
						<Input placeholder="Type a message…" bind:value={draft} class="flex-1" />
						<Button type="submit" size="icon" aria-label="Send"><Send class="h-4 w-4" /></Button>
					</form>
				</div>
			</div>
		</div>
	</Card>
</div>
