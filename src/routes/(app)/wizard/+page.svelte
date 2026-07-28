<script lang="ts">
	import { Card, Input, Label, Select, Button, FormField, Textarea } from '$lib/ui';
	import { Check } from '@lucide/svelte';

	const STEPS = [
		{ id: 1, title: 'Account', description: 'Your account details' },
		{ id: 2, title: 'Company', description: 'Business information' },
		{ id: 3, title: 'Plan', description: 'Choose your plan' },
		{ id: 4, title: 'Review', description: 'Confirm and finish' }
	];

	let step = $state(1);
	let form = $state({
		name: '', email: '', password: '',
		company: '', website: '', size: '1-10',
		plan: 'Pro'
	});

	let done = $state(false);
	function next() { step = Math.min(4, step + 1); }
	function back() { step = Math.max(1, step - 1); }
	function submit() { done = true; }
</script>

<div class="space-y-6">
	<div>
		<h1 class="text-2xl font-semibold tracking-tight">Wizard</h1>
		<p class="mt-1 text-sm text-muted-foreground">Multi-step onboarding flow</p>
	</div>

	<Card>
		<!-- Stepper -->
		<div class="flex items-center justify-between mb-8">
			{#each STEPS as s, i}
				<div class="flex items-center {i < STEPS.length - 1 ? 'flex-1' : ''}">
					<div class="flex items-center gap-3">
						<div
							class="flex h-9 w-9 items-center justify-center rounded-full font-semibold text-sm transition-colors {
								step > s.id ? 'bg-success text-success-foreground' :
								step === s.id ? 'bg-primary text-primary-foreground' :
								'bg-muted text-muted-foreground'
							}"
						>
							{#if step > s.id}<Check class="h-4 w-4" />{:else}{s.id}{/if}
						</div>
						<div class="hidden sm:block">
							<p class="text-sm font-medium">{s.title}</p>
							<p class="text-xs text-muted-foreground">{s.description}</p>
						</div>
					</div>
					{#if i < STEPS.length - 1}
						<div class="flex-1 h-px bg-border mx-3 sm:mx-4"></div>
					{/if}
				</div>
			{/each}
		</div>

		<!-- Content -->
		{#if done}
			<div class="text-center py-12">
				<div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/15 text-success mb-4">
					<Check class="h-7 w-7" />
				</div>
				<h2 class="text-xl font-semibold">You're all set!</h2>
				<p class="mt-2 text-sm text-muted-foreground">Welcome to Apex, {form.name || 'friend'}.</p>
				<Button class="mt-6" onclick={() => { done = false; step = 1; }}>Start over</Button>
			</div>
		{:else if step === 1}
			<div class="grid gap-4 md:grid-cols-2 max-w-2xl">
				<FormField label="Full name" required><Input bind:value={form.name} /></FormField>
				<FormField label="Email" required><Input type="email" bind:value={form.email} /></FormField>
				<FormField label="Password" required class="md:col-span-2"><Input type="password" bind:value={form.password} /></FormField>
			</div>
		{:else if step === 2}
			<div class="grid gap-4 md:grid-cols-2 max-w-2xl">
				<FormField label="Company name" required><Input bind:value={form.company} /></FormField>
				<FormField label="Website"><Input type="url" bind:value={form.website} placeholder="https://" /></FormField>
				<FormField label="Company size">
					<Select bind:value={form.size}>
						<option>1-10</option><option>11-50</option><option>51-200</option><option>200+</option>
					</Select>
				</FormField>
			</div>
		{:else if step === 3}
			<div class="grid gap-4 md:grid-cols-3 max-w-3xl">
				{#each [
					{ name: 'Starter', price: '$0', features: ['1 workspace', '3 members', 'Community support'] },
					{ name: 'Pro', price: '$29', features: ['10 workspaces', 'Unlimited members', 'Priority support'] },
					{ name: 'Business', price: '$99', features: ['Unlimited workspaces', 'SSO', 'Dedicated CSM'] }
				] as p}
					<button
						type="button"
						onclick={() => (form.plan = p.name)}
						class="text-left rounded-xl border-2 p-5 transition-colors {form.plan === p.name ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}"
					>
						<p class="font-semibold">{p.name}</p>
						<p class="text-2xl font-bold mt-2">{p.price}<span class="text-sm font-normal text-muted-foreground">/mo</span></p>
						<ul class="mt-4 space-y-1.5 text-sm">
							{#each p.features as f}
								<li class="flex items-center gap-2"><Check class="h-3.5 w-3.5 text-success" />{f}</li>
							{/each}
						</ul>
					</button>
				{/each}
			</div>
		{:else if step === 4}
			<div class="max-w-2xl space-y-4">
				<Card>
					<h3 class="font-semibold mb-3">Review your details</h3>
					<dl class="space-y-2 text-sm">
						<div class="flex justify-between border-b border-border pb-2"><dt class="text-muted-foreground">Name</dt><dd>{form.name || '—'}</dd></div>
						<div class="flex justify-between border-b border-border pb-2"><dt class="text-muted-foreground">Email</dt><dd>{form.email || '—'}</dd></div>
						<div class="flex justify-between border-b border-border pb-2"><dt class="text-muted-foreground">Company</dt><dd>{form.company || '—'}</dd></div>
						<div class="flex justify-between border-b border-border pb-2"><dt class="text-muted-foreground">Size</dt><dd>{form.size}</dd></div>
						<div class="flex justify-between"><dt class="text-muted-foreground">Plan</dt><dd class="font-semibold">{form.plan}</dd></div>
					</dl>
				</Card>
			</div>
		{/if}

		{#if !done}
			<div class="flex justify-between pt-8 mt-8 border-t border-border">
				<Button variant="ghost" onclick={back} disabled={step === 1}>Back</Button>
				{#if step === 4}
					<Button onclick={submit}>Complete setup</Button>
				{:else}
					<Button onclick={next}>Next step</Button>
				{/if}
			</div>
		{/if}
	</Card>
</div>
