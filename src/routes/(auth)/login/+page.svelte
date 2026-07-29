<script lang="ts">
	import { Button, Input, Label, Checkbox, Card } from '$lib/ui';
	import { APP_CONFIG } from '$lib/config';
	import { enhance } from '$app/forms';

	let email = $state('admin@miromi.id');
	let password = $state('');
	let remember = $state(true);
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

	<Card title="Welcome back" description="Sign in to continue to your dashboard">
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
				<Label for="email">Email</Label>
				<Input id="email" name="email" type="email" bind:value={email} placeholder="you@example.com" required />
				{#if errors.email}<p class="text-xs text-destructive">{errors.email}</p>{/if}
			</div>

			<div class="space-y-1.5">
				<div class="flex items-center justify-between">
					<Label for="password">Password</Label>
					<a href="/forgot-password" class="text-xs text-primary hover:underline">Forgot?</a>
				</div>
				<Input id="password" name="password" type="password" bind:value={password} placeholder="••••••••" required />
				{#if errors.password}<p class="text-xs text-destructive">{errors.password}</p>{/if}
			</div>

			<label class="flex items-center gap-2 text-sm">
				<Checkbox bind:checked={remember} />
				<span>Remember me for 30 days</span>
			</label>

			<Button class="w-full" disabled={loading}>
				{loading ? 'Signing in...' : 'Sign in'}
			</Button>
		</form>
		<div class="mt-4 text-center text-sm text-muted-foreground">
			Don't have an account?
			<a href="/register" class="text-primary hover:underline">Sign up</a>
		</div>
	</Card>
</div>
