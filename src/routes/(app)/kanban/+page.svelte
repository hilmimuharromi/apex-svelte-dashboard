<script lang="ts">
	import { Card, Badge, Button, Avatar, Modal, Input, Label, Select, Textarea } from '$lib/ui';
	let taskModal = $state(false);
	import { Plus, MessageSquare, Paperclip } from '@lucide/svelte';

	type Task = {
		id: string;
		title: string;
		description?: string;
		priority: 'low' | 'medium' | 'high';
		assignees: { initials: string; name: string }[];
		comments: number;
		attachments: number;
		tags: string[];
	};

	type Column = { id: string; title: string; color: string; tasks: Task[] };

	let columns = $state<Column[]>([
		{
			id: 'backlog', title: 'Backlog', color: 'bg-muted',
			tasks: [
				{ id: 't1', title: 'Design new landing page hero', priority: 'high', assignees: [{ initials: 'EW', name: 'Emma' }], comments: 3, attachments: 2, tags: ['Design', 'Marketing'] },
				{ id: 't2', title: 'Research competitor pricing pages', priority: 'low', assignees: [{ initials: 'JC', name: 'James' }], comments: 1, attachments: 0, tags: ['Research'] }
			]
		},
		{
			id: 'todo', title: 'To Do', color: 'bg-info/20',
			tasks: [
				{ id: 't3', title: 'Set up staging environment', priority: 'high', assignees: [{ initials: 'DK', name: 'David' }, { initials: 'SG', name: 'Sofia' }], comments: 5, attachments: 1, tags: ['DevOps'] },
				{ id: 't4', title: 'Update team onboarding docs', priority: 'medium', assignees: [{ initials: 'MS', name: 'Maria' }], comments: 2, attachments: 3, tags: ['Docs'] },
				{ id: 't5', title: 'Migrate legacy API endpoints', priority: 'medium', assignees: [{ initials: 'AT', name: 'Alex' }], comments: 8, attachments: 0, tags: ['Backend'] }
			]
		},
		{
			id: 'progress', title: 'In Progress', color: 'bg-warning/20',
			tasks: [
				{ id: 't6', title: 'Implement dark mode across dashboard', priority: 'high', assignees: [{ initials: 'YT', name: 'Yuki' }, { initials: 'NR', name: 'Nina' }], comments: 12, attachments: 4, tags: ['Frontend', 'Design'] },
				{ id: 't7', title: 'Add rate limiting to public API', priority: 'high', assignees: [{ initials: 'PP', name: 'Priya' }], comments: 6, attachments: 1, tags: ['Backend', 'Security'] }
			]
		},
		{
			id: 'review', title: 'Review', color: 'bg-primary/20',
			tasks: [
				{ id: 't8', title: 'Q4 analytics report', priority: 'medium', assignees: [{ initials: 'LO', name: 'Liam' }], comments: 4, attachments: 2, tags: ['Analytics'] }
			]
		},
		{
			id: 'done', title: 'Done', color: 'bg-success/20',
			tasks: [
				{ id: 't9', title: 'Ship v2.1 release notes', priority: 'low', assignees: [{ initials: 'MB', name: 'Marcus' }], comments: 1, attachments: 0, tags: ['Marketing'] },
				{ id: 't10', title: 'Fix mobile navigation z-index', priority: 'medium', assignees: [{ initials: 'CM', name: 'Carlos' }], comments: 2, attachments: 0, tags: ['Bug', 'Frontend'] }
			]
		}
	]);

	let draggedTask = $state<{ task: Task; fromCol: string } | null>(null);
	let dragOverCol = $state<string | null>(null);

	function onDragStart(task: Task, fromCol: string) {
		draggedTask = { task, fromCol };
	}

	function onDragOver(e: DragEvent, colId: string) {
		e.preventDefault();
		dragOverCol = colId;
	}

	function onDrop(e: DragEvent, targetColId: string) {
		e.preventDefault();
		dragOverCol = null;
		if (!draggedTask || draggedTask.fromCol === targetColId) { draggedTask = null; return; }
		columns = columns.map((col) => {
			if (col.id === draggedTask!.fromCol) return { ...col, tasks: col.tasks.filter((t) => t.id !== draggedTask!.task.id) };
			if (col.id === targetColId) return { ...col, tasks: [...col.tasks, draggedTask!.task] };
			return col;
		});
		draggedTask = null;
	}

	const PRIORITY_VARIANT = { low: 'default', medium: 'warning', high: 'danger' } as const;
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-semibold tracking-tight">Kanban</h1>
			<p class="mt-1 text-sm text-muted-foreground">Drag tasks between columns to update status</p>
		</div>
		<Button onclick={() => (taskModal = true)}><Plus class="h-4 w-4" /> New Task</Button>
	</div>

	<!-- New Task Modal -->
	<Modal bind:open={taskModal} title="Create New Task">
		<div class="space-y-4">
			<div class="space-y-1.5"><Label>Task Title</Label><Input placeholder="E.g. Update landing page copy" /></div>
			<div class="space-y-1.5"><Label>Description (optional)</Label><Textarea placeholder="Add details..." /></div>
			<div class="grid grid-cols-2 gap-4">
				<div class="space-y-1.5"><Label>Priority</Label><Select><option>Low</option><option>Medium</option><option>High</option></Select></div>
				<div class="space-y-1.5"><Label>Status</Label><Select><option>Backlog</option><option>To Do</option><option>In Progress</option></Select></div>
			</div>
		</div>
		{#snippet footer()}
			<Button variant="ghost" onclick={() => (taskModal = false)}>Cancel</Button>
			<Button onclick={() => (taskModal = false)}>Create Task</Button>
		{/snippet}
	</Modal>

	<div class="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6">
		{#each columns as col (col.id)}
			<div
				class="w-72 shrink-0 rounded-xl border border-border p-3 transition-colors {dragOverCol === col.id ? 'bg-primary/5 border-primary/50' : 'bg-card'}"
				ondragover={(e) => onDragOver(e, col.id)}
				ondrop={(e) => onDrop(e, col.id)}
				ondragleave={() => (dragOverCol = null)}
				role="list"
			>
				<div class="flex items-center justify-between mb-3 px-1">
					<div class="flex items-center gap-2">
						<span class="h-2 w-2 rounded-full {col.color}"></span>
						<h3 class="font-semibold text-sm">{col.title}</h3>
						<span class="text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5">{col.tasks.length}</span>
					</div>
					<button class="text-muted-foreground hover:text-foreground" aria-label="Add task"><Plus class="h-4 w-4" /></button>
				</div>

				<div class="space-y-2">
					{#each col.tasks as task (task.id)}
						<div
							draggable="true"
							ondragstart={() => onDragStart(task, col.id)}
							class="rounded-lg border border-border bg-background p-3 cursor-grab active:cursor-grabbing hover:border-primary/50 hover:shadow-sm transition-all"
							role="listitem"
						>
							<div class="flex flex-wrap gap-1 mb-2">
								{#each task.tags as tag}
									<Badge variant="outline" class="text-[10px]">{tag}</Badge>
								{/each}
							</div>
							<p class="text-sm font-medium leading-snug">{task.title}</p>
							<div class="mt-3 flex items-center justify-between">
								<Badge variant={PRIORITY_VARIANT[task.priority]} class="text-[10px] capitalize">{task.priority}</Badge>
								<div class="flex items-center gap-3 text-xs text-muted-foreground">
									{#if task.comments}
										<span class="inline-flex items-center gap-1"><MessageSquare class="h-3 w-3" />{task.comments}</span>
									{/if}
									{#if task.attachments}
										<span class="inline-flex items-center gap-1"><Paperclip class="h-3 w-3" />{task.attachments}</span>
									{/if}
									<div class="flex -space-x-1.5">
										{#each task.assignees as a}
											<Avatar initials={a.initials} size="xs" class="border-2 border-background" />
										{/each}
									</div>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>
