<script lang="ts">
	import { Card, Input, Label, Textarea, Select, Switch, Button, FormField, Avatar, Badge } from '$lib/ui';
	import { APP_CONFIG } from '$lib/config';

	let name = $state(APP_CONFIG.user.name);
	let email = $state('aigars@apex.dev');
	let timezone = $state('UTC+00:00');
	let theme = $state<'light' | 'dark' | 'system'>('system');
	let notifEmail = $state(true);
	let notifPush = $state(true);
	let notifMarketing = $state(false);
	let twoFactor = $state(false);
	let apiKeys = $state([
		{ id: 1, name: 'Production', prefix: 'sk_prod', created: '12 Jan 2026' },
		{ id: 2, name: 'Staging', prefix: 'sk_stg', created: '03 Feb 2026' }
	]);
</script>

<div class="space-y-6">
	<div>
		<h1 class="text-2xl font-semibold tracking-tight">Settings</h1>
		<p class="mt-1 text-sm text-muted-foreground">Manage your account preferences</p>
	</div>

	<div class="grid gap-6 lg:grid-cols-3">
		<div class="lg:col-span-2 space-y-6">
			<Card title="Profile" description="Update your personal information">
				<div class="flex items-center gap-4 mb-5">
					<Avatar initials={APP_CONFIG.user.initials} size="lg" />
					<div>
						<Button variant="outline" size="sm">Upload photo</Button>
						<p class="text-xs text-muted-foreground mt-1.5">PNG or JPG, max 2MB</p>
					</div>
				</div>
				<div class="grid gap-4 md:grid-cols-2">
					<FormField label="Full name"><Input bind:value={name} /></FormField>
					<FormField label="Email"><Input type="email" bind:value={email} /></FormField>
					<FormField label="Timezone">
						<Select bind:value={timezone}>
							<option>UTC-08:00 Pacific</option>
							<option>UTC-05:00 Eastern</option>
							<option>UTC+00:00</option>
							<option>UTC+07:00 Jakarta</option>
							<option>UTC+09:00 Tokyo</option>
						</Select>
					</FormField>
					<FormField label="Theme">
						<Select bind:value={theme}>
							<option value="light">Light</option>
							<option value="dark">Dark</option>
							<option value="system">System</option>
						</Select>
					</FormField>
				</div>
				<div class="pt-5 flex gap-2">
					<Button>Save changes</Button>
					<Button variant="ghost">Cancel</Button>
				</div>
			</Card>

			<Card title="Notifications" description="Choose what you want to be notified about">
				<div class="space-y-4">
					<label class="flex items-start gap-3 py-2">
						<Switch bind:checked={notifEmail} />
						<div>
							<p class="font-medium text-sm">Email notifications</p>
							<p class="text-xs text-muted-foreground">Get alerts for orders, mentions, and updates</p>
						</div>
					</label>
					<label class="flex items-start gap-3 py-2 border-t border-border pt-4">
						<Switch bind:checked={notifPush} />
						<div>
							<p class="font-medium text-sm">Push notifications</p>
							<p class="text-xs text-muted-foreground">Real-time browser and mobile alerts</p>
						</div>
					</label>
					<label class="flex items-start gap-3 py-2 border-t border-border pt-4">
						<Switch bind:checked={notifMarketing} />
						<div>
							<p class="font-medium text-sm">Marketing communications</p>
							<p class="text-xs text-muted-foreground">Product news, tips, and offers</p>
						</div>
					</label>
				</div>
			</Card>

			<Card title="Security" description="Manage your account security">
				<div class="space-y-4">
					<label class="flex items-start gap-3">
						<Switch bind:checked={twoFactor} />
						<div>
							<p class="font-medium text-sm">Two-factor authentication</p>
							<p class="text-xs text-muted-foreground">Add an extra layer of security via authenticator app</p>
						</div>
					</label>
					<div class="pt-4 border-t border-border">
						<Button variant="outline" size="sm">Change password</Button>
						<Button variant="ghost" size="sm">Sign out all devices</Button>
					</div>
				</div>
			</Card>

			<Card title="API Keys" description="Manage keys for programmatic access">
				<div class="space-y-2">
					{#each apiKeys as key}
						<div class="flex items-center justify-between py-2 border-b border-border last:border-0">
							<div>
								<p class="font-medium text-sm">{key.name}</p>
								<p class="text-xs text-muted-foreground font-mono">{key.prefix}_••••••••••••</p>
							</div>
							<div class="flex items-center gap-3">
								<span class="text-xs text-muted-foreground">Created {key.created}</span>
								<Button variant="ghost" size="sm">Revoke</Button>
							</div>
						</div>
					{/each}
				</div>
				<div class="pt-4"><Button variant="outline" size="sm">Generate new key</Button></div>
			</Card>
		</div>

		<div class="space-y-6">
			<Card title="Account plan">
				<div class="flex items-center gap-2 mb-3">
					<Badge variant="primary">Enterprise</Badge>
					<span class="text-xs text-muted-foreground">renews Jan 2027</span>
				</div>
				<p class="text-sm text-muted-foreground mb-4">Unlimited seats, priority support, custom integrations.</p>
				<Button variant="outline" class="w-full">Manage subscription</Button>
			</Card>

			<Card title="Danger zone">
				<p class="text-sm text-muted-foreground mb-4">Permanently delete your account and all data.</p>
				<Button variant="danger" class="w-full">Delete account</Button>
			</Card>
		</div>
	</div>
</div>
