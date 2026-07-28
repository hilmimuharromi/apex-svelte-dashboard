<script lang="ts">
	import {
		Button, Card, Input, Textarea, Label, FormField,
		Checkbox, Switch, Select, Badge, StatusPill,
		Avatar, StatCard, ProgressBar, Spinner, Skeleton,
		EmptyState, Pagination, Modal, Toaster, Table
	} from '$lib/ui';
	import type { TableColumn } from '$lib/ui';
	import { toast } from '$lib/stores/toast.svelte';
	import { money } from '$lib/utils';
	import { Search, Plus, Trash2, Download, Inbox } from '@lucide/svelte';

	// ── Interactive state for live demos ──
	let inputVal = $state('');
	let textareaVal = $state('');
	let checkboxVal = $state(true);
	let switchVal = $state(false);
	let selectVal = $state('option1');
	let modalOpen = $state(false);
	let progressVal = $state(72);
	let currentPage = $state(1);

	// ── Table demo data ──
	type Row = { id: string; name: string; email: string; status: string };
	const tableData: Row[] = [
		{ id: '1', name: 'Emma Wilson', email: 'emma@example.com', status: 'Completed' },
		{ id: '2', name: 'James Chen', email: 'james@example.com', status: 'Processing' },
		{ id: '3', name: 'Sofia Garcia', email: 'sofia@example.com', status: 'Cancelled' },
	];

	const columns: TableColumn<Row>[] = [
		{ key: 'name', label: 'NAME' },
		{ key: 'email', label: 'EMAIL' },
		{ key: 'status', label: 'STATUS' },
	];

	// ── Code examples (as strings to avoid Svelte parsing) ──
	const code = {
		button: `<Button variant="primary" onclick={handleClick}>Save</Button>
<Button variant="danger" size="sm"><Trash2 class="h-4 w-4" /> Delete</Button>
<Button size="icon" variant="outline"><Plus class="h-4 w-4" /></Button>`,
		input: `let value = $state('');
<Input type="email" bind:value placeholder="you@example.com" />`,
		textarea: `let value = $state('');
<Textarea bind:value rows={4} placeholder="..." />`,
		select: `<Select options={[{ value: '1', label: 'One' }]} bind:value />
<Select><option value="a">A</option></Select>`,
		checkbox: `let checked = $state(true);
<Checkbox bind:checked />
<Switch bind:checked />`,
		badge: `<Badge variant="success">Active</Badge>
<StatusPill status="Completed" />  // auto variant`,
		card: `<Card title="Title" description="...">content</Card>

<Card>
  children content
  {#snippet footer()}...{/snippet}
</Card>`,
		statcard: `<StatCard label="Revenue" value="$48,295" change="+12.5%" trend="up" />`,
		table: `const columns: TableColumn<Row>[] = [
  { key: 'name', label: 'NAME' },
  { key: 'status', label: 'STATUS',
    cell: (row) => <StatusPill status={row.status} /> }
];
<Table {columns} rows={data} onRowClick={handleClick} />`,
		progress: `<ProgressBar value={72} />`,
		avatar: `<Avatar name="John Doe" />
<Avatar src="/img.jpg" name="Jane" size="lg" />`,
		modal: `let open = $state(false);
<Button onclick={() => open = true}>Open</Button>
<Modal bind:open title="Title" description="...">
  Content
  {#snippet footer()}
    <Button variant="ghost">Cancel</Button>
    <Button>Confirm</Button>
  {/snippet}
</Modal>`,
		spinner: `<Spinner class="h-6 w-6 text-primary" />
<Skeleton class="h-4 w-full" />`,
		empty: `<EmptyState icon={Inbox} title="No data" description="...">
  {#snippet action()}
    <Button>Create</Button>
  {/snippet}
</EmptyState>`,
		pagination: `let page = $state(1);
<Pagination bind:page total={150} pageSize={10} onChange={loadData} />`,
		toast: `import { toast } from '$lib/stores/toast.svelte';
toast.success('Title', 'Description');
toast.danger('Error', 'Message');
toast.info('Info', 'Message');`,
		apiServer: `import { api } from '$lib/server/api';

// In +page.server.ts load/actions:
const users = await api.get<User[]>('/users', {
  cookies: event.cookies  // forward auth
});
await api.post('/auth/login', {
  body: { email, password }
});`,
		apiClient: `import { clientApi } from '$lib/api';

// In components / +page.ts:
const data = await clientApi.get<User[]>(
  '/users',
  { query: { page: 1, limit: 20 } }
);
await clientApi.post('/orders', {
  body: { productId: 123 }
});`,
	};
</script>

<svelte:head><title>Components — Apex Dashboard</title></svelte:head>

<div class="space-y-10 max-w-5xl">
	<div>
		<h1 class="text-2xl font-bold">Component Library</h1>
		<p class="text-muted-foreground text-sm mt-1">
			All reusable UI components. Import from <code class="text-primary">$lib/ui</code>.
		</p>
	</div>

	<!-- ═══════════════ BUTTON ═══════════════ -->
	<section class="space-y-3">
		<h2 class="text-lg font-semibold">Button</h2>
		<p class="text-sm text-muted-foreground">Variants: <code>primary</code>, <code>secondary</code>, <code>outline</code>, <code>ghost</code>, <code>danger</code>, <code>link</code>. Sizes: <code>sm</code>, <code>md</code>, <code>lg</code>, <code>icon</code>.</p>
		<Card>
			<div class="flex flex-wrap items-center gap-3 p-2">
				<Button variant="primary">Primary</Button>
				<Button variant="secondary">Secondary</Button>
				<Button variant="outline">Outline</Button>
				<Button variant="ghost">Ghost</Button>
				<Button variant="danger">Danger</Button>
				<Button variant="link">Link</Button>
				<Button size="sm">Small</Button>
				<Button size="lg">Large</Button>
				<Button size="icon" variant="outline"><Plus class="h-4 w-4" /></Button>
				<Button disabled>Disabled</Button>
			</div>
		</Card>
		<pre class="text-xs bg-muted rounded-lg p-4 overflow-x-auto"><code>{code.button}</code></pre>
	</section>

	<!-- ═══════════════ INPUT ═══════════════ -->
	<section class="space-y-3">
		<h2 class="text-lg font-semibold">Input</h2>
		<p class="text-sm text-muted-foreground">Standard text input. Supports <code>bind:value</code>, all native HTML input attributes.</p>
		<Card>
			<div class="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
				<FormField label="Email" description="We'll never share your email." required>
					<Input type="email" bind:value={inputVal} placeholder="you@example.com" />
				</FormField>
				<FormField label="Password" error="Password is required">
					<Input type="password" placeholder="••••••••" />
				</FormField>
			</div>
			<p class="text-xs text-muted-foreground px-5 pb-3">Bound value: <code>{inputVal || '(empty)'}</code></p>
		</Card>
		<pre class="text-xs bg-muted rounded-lg p-4 overflow-x-auto"><code>{code.input}</code></pre>
	</section>

	<!-- ═══════════════ TEXTAREA ═══════════════ -->
	<section class="space-y-3">
		<h2 class="text-lg font-semibold">Textarea</h2>
		<Card>
			<div class="p-5">
				<FormField label="Description">
					<Textarea bind:value={textareaVal} placeholder="Write something..." rows={4} />
				</FormField>
			</div>
		</Card>
		<pre class="text-xs bg-muted rounded-lg p-4 overflow-x-auto"><code>{code.textarea}</code></pre>
	</section>

	<!-- ═══════════════ SELECT ═══════════════ -->
	<section class="space-y-3">
		<h2 class="text-lg font-semibold">Select</h2>
		<p class="text-sm text-muted-foreground">Use <code>options</code> prop or <code>&lt;option&gt;</code> children.</p>
		<Card>
			<div class="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
				<FormField label="Via options prop">
					<Select options={[
						{ value: 'option1', label: 'Option One' },
						{ value: 'option2', label: 'Option Two' },
					]} bind:value={selectVal} />
				</FormField>
				<FormField label="Via children">
					<Select>
						<option value="a">Choice A</option>
						<option value="b">Choice B</option>
					</Select>
				</FormField>
			</div>
		</Card>
		<pre class="text-xs bg-muted rounded-lg p-4 overflow-x-auto"><code>{code.select}</code></pre>
	</section>

	<!-- ═══════════════ CHECKBOX & SWITCH ═══════════════ -->
	<section class="space-y-3">
		<h2 class="text-lg font-semibold">Checkbox &amp; Switch</h2>
		<Card>
			<div class="p-5 flex flex-col gap-4">
				<label class="flex items-center gap-2 text-sm">
					<Checkbox bind:checked={checkboxVal} />
					<span>Checkbox value: {checkboxVal}</span>
				</label>
				<div class="flex items-center gap-3">
					<Switch bind:checked={switchVal} />
					<span class="text-sm">Switch value: {switchVal}</span>
				</div>
			</div>
		</Card>
		<pre class="text-xs bg-muted rounded-lg p-4 overflow-x-auto"><code>{code.checkbox}</code></pre>
	</section>

	<!-- ═══════════════ BADGE & STATUSPILL ═══════════════ -->
	<section class="space-y-3">
		<h2 class="text-lg font-semibold">Badge &amp; StatusPill</h2>
		<p class="text-sm text-muted-foreground"><code>Badge</code>: manual variant. <code>StatusPill</code>: auto-maps status string → variant.</p>
		<Card>
			<div class="p-5 flex flex-wrap items-center gap-3">
				<Badge>Default</Badge>
				<Badge variant="primary">Primary</Badge>
				<Badge variant="success">Success</Badge>
				<Badge variant="warning">Warning</Badge>
				<Badge variant="danger">Danger</Badge>
				<Badge variant="info">Info</Badge>
				<Badge variant="outline">Outline</Badge>
			</div>
			<hr class="border-border my-2" />
			<div class="p-5 pt-3 flex flex-wrap items-center gap-3">
				<StatusPill status="Completed" />
				<StatusPill status="Processing" />
				<StatusPill status="Pending" />
				<StatusPill status="Cancelled" />
				<StatusPill status="Shipped" />
				<StatusPill status="Paid" />
				<StatusPill status="Active" />
			</div>
		</Card>
		<pre class="text-xs bg-muted rounded-lg p-4 overflow-x-auto"><code>{code.badge}</code></pre>
	</section>

	<!-- ═══════════════ CARD ═══════════════ -->
	<section class="space-y-3">
		<h2 class="text-lg font-semibold">Card</h2>
		<p class="text-sm text-muted-foreground">Props: <code>title</code>, <code>description</code>. Snippets: <code>children</code>, <code>header</code>, <code>footer</code>, <code>action</code>.</p>
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
			<Card title="Simple Card" description="With title + description">
				<div class="p-5 text-sm text-muted-foreground">Card body content goes here.</div>
			</Card>
			<Card>
				{#snippet header()}
				<div class="flex items-center justify-between p-5 border-b border-border">
					<span class="font-semibold">Custom Header</span>
					<Badge variant="primary">New</Badge>
				</div>
				{/snippet}
				<div class="p-5 text-sm text-muted-foreground">Card with custom header snippet.</div>
				{#snippet footer()}
				<div class="flex justify-end gap-2 p-4 border-t border-border">
					<Button variant="ghost" size="sm">Cancel</Button>
					<Button size="sm">Save</Button>
				</div>
				{/snippet}
			</Card>
		</div>
		<pre class="text-xs bg-muted rounded-lg p-4 overflow-x-auto"><code>{code.card}</code></pre>
	</section>

	<!-- ═══════════════ STATCARD ═══════════════ -->
	<section class="space-y-3">
		<h2 class="text-lg font-semibold">StatCard</h2>
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
			<StatCard label="Revenue" value={money(58295000)} delta={12.5} />
				<StatCard label="Users" value="2,847" delta={8.2} />
				<StatCard label="Churn" value="1.2%" delta={-0.3} />
				<StatCard label="Orders" value="1,432" delta={-3.1} />
		</div>
		<pre class="text-xs bg-muted rounded-lg p-4 overflow-x-auto"><code>{code.statcard}</code></pre>
	</section>

	<!-- ═══════════════ TABLE ═══════════════ -->
	<section class="space-y-3">
		<h2 class="text-lg font-semibold">Table</h2>
		<p class="text-sm text-muted-foreground">Generic <code>&lt;T&gt;</code> table. Props: <code>columns</code>, <code>rows</code>, <code>onRowClick</code>. Column <code>cell</code> snippet for custom rendering.</p>
		<Table {columns} rows={tableData} rowKey={(r) => r.id} onRowClick={(r) => toast.info('Clicked', r.name)} />
		<pre class="text-xs bg-muted rounded-lg p-4 overflow-x-auto"><code>{code.table}</code></pre>
	</section>

	<!-- ═══════════════ PROGRESSBAR ═══════════════ -->
	<section class="space-y-3">
		<h2 class="text-lg font-semibold">ProgressBar</h2>
		<Card>
			<div class="p-5 space-y-4">
				<div>
					<div class="flex justify-between text-sm mb-1"><span>Revenue</span><span>{progressVal}%</span></div>
					<ProgressBar value={progressVal} />
				</div>
				<div class="flex gap-2">
					<Button size="sm" variant="outline" onclick={() => progressVal = Math.max(0, progressVal - 10)}>−10</Button>
					<Button size="sm" variant="outline" onclick={() => progressVal = Math.min(100, progressVal + 10)}>+10</Button>
				</div>
			</div>
		</Card>
		<pre class="text-xs bg-muted rounded-lg p-4 overflow-x-auto"><code>{code.progress}</code></pre>
	</section>

	<!-- ═══════════════ AVATAR ═══════════════ -->
	<section class="space-y-3">
		<h2 class="text-lg font-semibold">Avatar</h2>
		<Card>
			<div class="p-5 flex items-center gap-4">
				<Avatar name="John Doe" />
				<Avatar name="Jane Smith" />
				<Avatar src="https://api.dicebear.com/7.x/initials/svg?seed=Test+User" name="Test User" />
				<Avatar name="A" size="lg" />
			</div>
		</Card>
		<pre class="text-xs bg-muted rounded-lg p-4 overflow-x-auto"><code>{code.avatar}</code></pre>
	</section>

	<!-- ═══════════════ MODAL ═══════════════ -->
	<section class="space-y-3">
		<h2 class="text-lg font-semibold">Modal</h2>
		<p class="text-sm text-muted-foreground">Props: <code>open</code> (bindable), <code>title</code>, <code>description</code>, <code>maxWidth</code>. Snippets: <code>children</code>, <code>footer</code>.</p>
		<Card>
			<div class="p-5"><Button onclick={() => modalOpen = true}>Open Modal</Button></div>
		</Card>
		<pre class="text-xs bg-muted rounded-lg p-4 overflow-x-auto"><code>{code.modal}</code></pre>
	</section>

	<!-- ═══════════════ LOADING STATES ═══════════════ -->
	<section class="space-y-3">
		<h2 class="text-lg font-semibold">Spinner &amp; Skeleton</h2>
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
			<Card title="Spinner">
				<div class="p-5 flex items-center gap-4">
					<Spinner />
					<Spinner class="h-6 w-6" />
					<Spinner class="h-8 w-8 text-primary" />
				</div>
			</Card>
			<Card title="Skeleton">
				<div class="p-5 space-y-3">
					<Skeleton class="h-4 w-full" />
					<Skeleton class="h-4 w-3/4" />
					<Skeleton class="h-20 w-full" />
				</div>
			</Card>
		</div>
		<pre class="text-xs bg-muted rounded-lg p-4 overflow-x-auto"><code>{code.spinner}</code></pre>
	</section>

	<!-- ═══════════════ EMPTYSTATE ═══════════════ -->
	<section class="space-y-3">
		<h2 class="text-lg font-semibold">EmptyState</h2>
		<Card>
			<EmptyState icon={Inbox} title="No messages" description="You're all caught up.">
				{#snippet action()}
				<Button size="sm"><Plus class="h-4 w-4" /> New Message</Button>
				{/snippet}
			</EmptyState>
		</Card>
		<pre class="text-xs bg-muted rounded-lg p-4 overflow-x-auto"><code>{code.empty}</code></pre>
	</section>

	<!-- ═══════════════ PAGINATION ═══════════════ -->
	<section class="space-y-3">
		<h2 class="text-lg font-semibold">Pagination</h2>
		<Card>
			<div class="p-5">
				<Pagination page={currentPage} total={150} pageSize={10} onChange={(p) => currentPage = p} />
			</div>
		</Card>
		<pre class="text-xs bg-muted rounded-lg p-4 overflow-x-auto"><code>{code.pagination}</code></pre>
	</section>

	<!-- ═══════════════ TOAST ═══════════════ -->
	<section class="space-y-3">
		<h2 class="text-lg font-semibold">Toast (via store)</h2>
		<p class="text-sm text-muted-foreground">Import <code>toast</code> from <code>$lib/stores/toast.svelte</code>. Toaster is rendered in <code>(app)/+layout.svelte</code>.</p>
		<Card>
			<div class="p-5 flex flex-wrap gap-2">
				<Button variant="primary" onclick={() => toast.success('Saved!', 'Your changes are stored.')}>Success</Button>
				<Button variant="danger" onclick={() => toast.danger('Error', 'Something went wrong.')}>Danger</Button>
				<Button variant="outline" onclick={() => toast.info('Info', 'Here is a tip for you.')}>Info</Button>
			</div>
		</Card>
		<pre class="text-xs bg-muted rounded-lg p-4 overflow-x-auto"><code>{code.toast}</code></pre>
	</section>

	<!-- ═══════════════ API HELPERS ═══════════════ -->
	<section class="space-y-3">
		<h2 class="text-lg font-semibold">API Helpers</h2>
		<p class="text-sm text-muted-foreground">Server-side & client-side helpers ready to call your backend.</p>
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
			<Card title="Server (SSR)" description="src/lib/server/api.ts">
				<pre class="text-xs bg-muted rounded-lg p-3 overflow-x-auto mt-3"><code>{code.apiServer}</code></pre>
			</Card>
			<Card title="Client (browser)" description="src/lib/api.ts">
				<pre class="text-xs bg-muted rounded-lg p-3 overflow-x-auto mt-3"><code>{code.apiClient}</code></pre>
			</Card>
		</div>
	</section>
</div>

<!-- Modal demo -->
<Modal bind:open={modalOpen} title="Demo Modal" description="This is how a modal looks." maxWidth="md">
	<div class="space-y-3 py-2">
		<FormField label="Name">
			<Input placeholder="Enter name..." />
		</FormField>
		<FormField label="Role">
			<Select>
				<option value="admin">Admin</option>
				<option value="user">User</option>
			</Select>
		</FormField>
	</div>
	{#snippet footer()}
		<Button variant="ghost" onclick={() => modalOpen = false}>Cancel</Button>
		<Button onclick={() => { modalOpen = false; toast.success('Saved!', 'Changes applied.'); }}>Save Changes</Button>
	{/snippet}
</Modal>
