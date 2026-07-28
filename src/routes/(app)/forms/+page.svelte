<script lang="ts">
	import { Card, Input, Label, Textarea, Select, Checkbox, Switch, Button, FormField, Badge } from '$lib/ui';

	let name = $state('Aigars Silkalns');
	let email = $state('aigars@apex.dev');
	let bio = $state('Building beautiful dashboards.');
	let role = $state('Admin');
	let notifications = $state(true);
	let marketing = $state(false);
	let agree = $state(false);

	let submitted = $state(false);
	function submit(e: Event) {
		e.preventDefault();
		submitted = true;
		setTimeout(() => (submitted = false), 2500);
	}
</script>

<div class="space-y-6">
	<div>
		<h1 class="text-2xl font-semibold tracking-tight">Forms</h1>
		<p class="mt-1 text-sm text-muted-foreground">Form components and validation demos</p>
	</div>

	<div class="grid gap-6 lg:grid-cols-2">
		<Card title="Profile" description="Public information visible to your team">
			<form onsubmit={submit} class="space-y-4">
				<FormField label="Full name" required>
					<Input bind:value={name} placeholder="Your name" required />
				</FormField>
				<FormField label="Email" description="We'll never share your email">
					<Input type="email" bind:value={email} required />
				</FormField>
				<FormField label="Role">
					<Select bind:value={role}>
						<option>Admin</option><option>Editor</option><option>Viewer</option>
					</Select>
				</FormField>
				<FormField label="Bio" description="Max 200 characters">
					<Textarea bind:value={bio} rows={3} maxlength={200} />
				</FormField>
				<div class="pt-2 flex items-center gap-3">
					<Button type="submit">Save changes</Button>
					<Button variant="ghost" type="button">Cancel</Button>
					{#if submitted}<Badge variant="success">Saved ✓</Badge>{/if}
				</div>
			</form>
		</Card>

		<Card title="Preferences" description="Notifications and communication">
			<div class="space-y-5">
				<label class="flex items-start gap-3">
					<Switch bind:checked={notifications} />
					<div>
						<p class="font-medium text-sm">Product notifications</p>
						<p class="text-xs text-muted-foreground">Get notified about updates, releases, and improvements</p>
					</div>
				</label>
				<label class="flex items-start gap-3">
					<Switch bind:checked={marketing} />
					<div>
						<p class="font-medium text-sm">Marketing emails</p>
						<p class="text-xs text-muted-foreground">Occasional tips and offers (max 1/week)</p>
					</div>
				</label>
				<div class="pt-3 border-t border-border">
					<label class="flex items-center gap-2 text-sm">
						<Checkbox bind:checked={agree} />
						<span>I agree to the terms and conditions</span>
					</label>
				</div>
			</div>
		</Card>

		<Card title="Input showcase" description="All primitive input variants" class="lg:col-span-2">
			<div class="grid gap-4 md:grid-cols-3">
				<FormField label="Text"><Input placeholder="Hello" /></FormField>
				<FormField label="Email"><Input type="email" placeholder="you@example.com" /></FormField>
				<FormField label="Password"><Input type="password" placeholder="••••••••" /></FormField>
				<FormField label="Number"><Input type="number" value={42} /></FormField>
				<FormField label="Date"><Input type="date" /></FormField>
				<FormField label="Disabled"><Input disabled value="Cannot edit" /></FormField>
				<FormField label="Error state" error="This field is required"><Input value="" /></FormField>
				<FormField label="Select">
					<Select><option>Option A</option><option>Option B</option></Select>
				</FormField>
				<FormField label="Textarea"><Textarea rows={2} placeholder="Type here…" /></FormField>
			</div>
		</Card>
	</div>
</div>
