<!-- Global Error Boundary Layout (/src/routes/+error.svelte) -->
<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/ui';
	import { AlertTriangle, Home, ArrowLeft } from '@lucide/svelte';

	// The `page` store contains `error.message` and `status`.
	const status = $derived($page.status);
	const message = $derived($page.error?.message || 'Wait, what? An unexpected error occurred.');

	const isNotFound = $derived(status === 404);
</script>

<svelte:head>
	<title>{status} Error - Miromi Dashboard</title>
</svelte:head>

<div class="min-h-screen bg-background flex items-center justify-center p-4 selection:bg-primary/20">
	<div class="max-w-md w-full text-center space-y-6">
		<div class="relative w-32 h-32 mx-auto">
			<div class="absolute inset-0 bg-danger/20 rounded-full blur-xl animate-pulse"></div>
			<div class="relative w-full h-full bg-card border-2 border-danger/20 rounded-3xl rotate-12 flex items-center justify-center -rotate-3 transition-transform hover:rotate-0 shadow-lg">
				<AlertTriangle class="w-14 h-14 text-danger drop-shadow" />
			</div>
			<!-- Error Code Badge -->
			<div class="absolute -bottom-2 -right-2 bg-danger text-danger-foreground font-mono font-bold px-3 py-1 rounded-xl border-4 border-background shadow">
				{status}
			</div>
		</div>

		<div class="space-y-2">
			<h1 class="text-3xl font-bold tracking-tight text-foreground">
				{isNotFound ? 'Page not found' : 'Server error'}
			</h1>
			<p class="text-muted-foreground leading-relaxed">
				{isNotFound 
					? 'The page you are looking for doesn\'t exist or has been moved.' 
					: message}
			</p>
		</div>

		<div class="pt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
			<Button variant="outline" class="w-full sm:w-auto gap-2" onclick={() => history.back()}>
				<ArrowLeft class="w-4 h-4" /> Go Back
			</Button>
			<Button variant="primary" class="w-full sm:w-auto gap-2" href="/">
				<Home class="w-4 h-4" /> Back to Dashboard
			</Button>
		</div>
	</div>
</div>
