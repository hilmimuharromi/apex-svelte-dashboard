<script lang="ts">
	import { Button, Input, Label, Checkbox, Card } from '$lib/ui';
	import { APP_CONFIG } from '$lib/config';

	let email = $state('admin@apex.dev');
	let password = $state('');
	let remember = $state(true);

	function submit(e: Event) {
		e.preventDefault();
		window.location.href = '/';
	}
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
		<form onsubmit={submit} class="space-y-4">
			<div class="space-y-1.5">
				<Label for="email">Email</Label>
				<Input id="email" type="email" bind:value={email} placeholder="you@example.com" required />
			</div>
			<div class="space-y-1.5">
				<div class="flex items-center justify-between">
					<Label for="password">Password</Label>
					<a href="/forgot-password" class="text-xs text-primary hover:underline">Forgot?</a>
				</div>
				<Input id="password" type="password" bind:value={password} placeholder="••••••••" required />
			</div>
			<label class="flex items-center gap-2 text-sm">
				<Checkbox bind:checked={remember} />
				<span>Remember me for 30 days</span>
			</label>
			<Button type="submit" class="w-full">Sign in</Button>
		</form>
		<div class="mt-4 text-center text-sm text-muted-foreground">
			Don't have an account?
			<a href="/register" class="text-primary hover:underline">Sign up</a>
		</div>
	</Card>
</div>
