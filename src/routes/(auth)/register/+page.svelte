<script lang="ts">
	import { Button, Input, Label, Card } from '$lib/ui';
	import { APP_CONFIG } from '$lib/config';
	import { enhance } from '$app/forms';

	let form = $state({
		name: '',
		email: '',
		password: '',
		confirmPassword: ''
	});
	let loading = $state(false);
	let errors = $state<Record<string, string>>({});

	let { form: actionData } = $props();
	$effect(() => {
		if (actionData?.errors) errors = actionData.errors;
	});
</script>

<div class="w-full max-w-md">
	<div class="flex items-center gap-2 justify-center mb-6">
		<div class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
			{APP_CONFIG.brand.name[0]}
		</div>
		<div>
			<span class="text-lg font-semibold">{APP_CONFIG.brand.name}</span>
			<span class="ml-1 text-xs text-muted-foreground tracking-widest">{APP_CONFIG.brand.suffix}</span>
		</div>
	</div>

	<Card title="Create account" description="Get started with your free account">
		<form method="POST" use:enhance={() => {
			loading = true;
			errors = {};
			return async ({ update }) => {
				await update();
				loading = false;
			};
		}} class="space-y-4">
			{#if errors._}
				<div class="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
					{errors._}
				</div>
			{/if}

			<div class="space-y-1.5">
				<Label for="name">Full name</Label>
				<Input id="name" name="name" type="text" bind:value={form.name} placeholder="John Doe" required />
				{#if errors.name}<p class="text-xs text-destructive">{errors.name}</p>{/if}
			</div>

			<div class="space-y-1.5">
				<Label for="email">Email</Label>
				<Input id="email" name="email" type="email" bind:value={form.email} placeholder="you@example.com" required />
				{#if errors.email}<p class="text-xs text-destructive">{errors.email}</p>{/if}
			</div>

			<div class="space-y-1.5">
				<Label for="password">Password</Label>
				<Input id="password" name="password" type="password" bind:value={form.password} placeholder="••••••••" required />
				{#if errors.password}<p class="text-xs text-destructive">{errors.password}</p>{/if}
			</div>

			<div class="space-y-1.5">
				<Label for="confirmPassword">Confirm password</Label>
				<Input id="confirmPassword" name="confirmPassword" type="password" bind:value={form.confirmPassword} placeholder="••••••••" required />
				{#if errors.confirmPassword}<p class="text-xs text-destructive">{errors.confirmPassword}</p>{/if}
			</div>

			<Button class="w-full" disabled={loading}>
				{loading ? 'Creating account...' : 'Create account'}
			</Button>
		</form>
		<div class="mt-4 text-center text-sm text-muted-foreground">
			Already have an account?
			<a href="/login" class="text-primary hover:underline">Sign in</a>
		</div>
	</Card>
</div>
