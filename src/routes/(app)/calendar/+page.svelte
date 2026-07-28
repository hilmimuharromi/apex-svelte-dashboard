<script lang="ts">
	import { Card, Button, Badge, Avatar } from '$lib/ui';
	import { ChevronLeft, ChevronRight, Plus } from '@lucide/svelte';

	type Event = {
		id: string;
		title: string;
		date: string; // YYYY-MM-DD
		time?: string;
		color: 'primary' | 'success' | 'warning' | 'info' | 'danger';
		attendees?: string[];
	};

	const EVENTS: Event[] = [
		{ id: '1', title: 'Product review', date: '2026-07-02', time: '10:00', color: 'primary', attendees: ['EW', 'JC'] },
		{ id: '2', title: 'Design sync', date: '2026-07-05', time: '14:00', color: 'info', attendees: ['SG'] },
		{ id: '3', title: 'Sprint planning', date: '2026-07-08', time: '09:30', color: 'primary', attendees: ['EW', 'DK', 'MS'] },
		{ id: '4', title: 'Q3 kickoff', date: '2026-07-10', time: '15:00', color: 'success', attendees: ['EW', 'JC', 'SG', 'DK'] },
		{ id: '5', title: 'Deploy release v2.1', date: '2026-07-15', color: 'warning' },
		{ id: '6', title: 'Team lunch', date: '2026-07-17', time: '12:30', color: 'success' },
		{ id: '7', title: 'Client demo — Acme', date: '2026-07-22', time: '11:00', color: 'danger', attendees: ['EW', 'JC'] },
		{ id: '8', title: 'All-hands', date: '2026-07-24', time: '16:00', color: 'primary' },
		{ id: '9', title: '1:1 with Emma', date: '2026-07-28', time: '10:00', color: 'info', attendees: ['EW'] },
		{ id: '10', title: 'End of month review', date: '2026-07-30', time: '15:00', color: 'primary' }
	];

	const COLOR_BG = {
		primary: 'bg-primary/15 text-primary border-l-primary',
		success: 'bg-success/15 text-success border-l-success',
		warning: 'bg-warning/15 text-warning border-l-warning',
		info: 'bg-info/15 text-info border-l-info',
		danger: 'bg-danger/15 text-danger border-l-danger'
	};

	let year = $state(2026);
	let month = $state(6); // July (0-indexed)

	const monthName = $derived(new Date(year, month, 1).toLocaleString('en-US', { month: 'long' }));
	const firstDay = $derived(new Date(year, month, 1).getDay());
	const daysInMonth = $derived(new Date(year, month + 1, 0).getDate());
	const today = new Date();
	const isToday = (y: number, m: number, d: number) => today.getFullYear() === y && today.getMonth() === m && today.getDate() === d;

	const cells = $derived.by(() => {
		const c: { day: number | null; date: string }[] = [];
		for (let i = 0; i < firstDay; i++) c.push({ day: null, date: '' });
		for (let d = 1; d <= daysInMonth; d++) {
			const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
			c.push({ day: d, date: dateStr });
		}
		while (c.length % 7 !== 0) c.push({ day: null, date: '' });
		return c;
	});

	const eventsFor = (date: string) => EVENTS.filter((e) => e.date === date);

	let selectedDate = $state('2026-07-10');
	const selectedEvents = $derived(EVENTS.filter((e) => e.date === selectedDate).sort((a, b) => (a.time ?? '').localeCompare(b.time ?? '')));

	function prev() { if (--month < 0) { month = 11; year--; } }
	function next() { if (++month > 11) { month = 0; year++; } }
	function goToday() {
		year = today.getFullYear();
		month = today.getMonth();
		selectedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
	}
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-semibold tracking-tight">Calendar</h1>
			<p class="mt-1 text-sm text-muted-foreground">Team schedule and events</p>
		</div>
		<Button><Plus class="h-4 w-4" /> New Event</Button>
	</div>

	<div class="grid gap-6 lg:grid-cols-[1fr_320px]">
		<Card class="p-0 overflow-hidden">
			<div class="flex items-center justify-between p-4 border-b border-border">
				<div class="flex items-center gap-2">
					<Button variant="outline" size="sm" onclick={goToday}>Today</Button>
					<button onclick={prev} class="p-1.5 rounded-lg hover:bg-muted" aria-label="Previous month"><ChevronLeft class="h-4 w-4" /></button>
					<button onclick={next} class="p-1.5 rounded-lg hover:bg-muted" aria-label="Next month"><ChevronRight class="h-4 w-4" /></button>
					<h2 class="ml-2 text-lg font-semibold">{monthName} {year}</h2>
				</div>
			</div>

			<div class="grid grid-cols-7 border-b border-border bg-muted/30">
				{#each ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as d}
					<div class="p-2 text-center text-xs uppercase tracking-wider font-medium text-muted-foreground">{d}</div>
				{/each}
			</div>

			<div class="grid grid-cols-7">
				{#each cells as cell, i}
					<button
						type="button"
						class="min-h-24 p-2 border-r border-b border-border text-left align-top hover:bg-muted/30 transition-colors {cell.day ? '' : 'bg-muted/10 cursor-default'} {selectedDate === cell.date ? 'bg-primary/5 ring-1 ring-primary/50 ring-inset' : ''}"
						class:last-in-row={(i + 1) % 7 === 0}
						onclick={() => cell.day && (selectedDate = cell.date)}
						disabled={!cell.day}
					>
						{#if cell.day}
							<div class="flex items-center justify-between">
								<span class="text-sm font-medium {isToday(year, month, cell.day) ? 'inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground' : ''}">
									{cell.day}
								</span>
							</div>
							<div class="mt-1 space-y-0.5">
								{#each eventsFor(cell.date).slice(0, 2) as ev}
									<div class="truncate text-[10px] px-1.5 py-0.5 rounded border-l-2 {COLOR_BG[ev.color]}">
										{#if ev.time}<span class="font-medium">{ev.time}</span>{/if}
										{ev.title}
									</div>
								{/each}
								{#if eventsFor(cell.date).length > 2}
									<div class="text-[10px] text-muted-foreground pl-1">+{eventsFor(cell.date).length - 2} more</div>
								{/if}
							</div>
						{/if}
					</button>
				{/each}
			</div>
		</Card>

		<Card>
			<h3 class="font-semibold">
				{new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
			</h3>
			<p class="text-xs text-muted-foreground mt-0.5">{selectedEvents.length} event{selectedEvents.length !== 1 ? 's' : ''}</p>

			<div class="mt-4 space-y-3">
				{#if selectedEvents.length === 0}
					<div class="py-8 text-center text-sm text-muted-foreground">
						No events on this day.
					</div>
				{:else}
					{#each selectedEvents as ev}
						<div class="rounded-lg border-l-4 {COLOR_BG[ev.color]} p-3">
							<div class="flex items-start justify-between gap-2">
								<div class="flex-1 min-w-0">
									<p class="font-medium text-sm text-foreground">{ev.title}</p>
									{#if ev.time}
										<p class="text-xs text-muted-foreground mt-0.5">{ev.time}</p>
									{/if}
								</div>
							</div>
							{#if ev.attendees}
								<div class="mt-2 flex -space-x-1.5">
									{#each ev.attendees as a}
										<Avatar initials={a} size="xs" class="border-2 border-background" />
									{/each}
								</div>
							{/if}
						</div>
					{/each}
				{/if}
			</div>
		</Card>
	</div>
</div>
