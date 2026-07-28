<script lang="ts">
	import { Card, Input, Button } from '$lib/ui';
	import { Search, BookOpen, MessageCircle, FileQuestion, LifeBuoy, ArrowRight } from '@lucide/svelte';
	import { toast } from '$lib/stores/toast.svelte';

	const CATEGORIES = [
		{ id: '1', title: 'Getting Started', icon: BookOpen, desc: 'Setup, installation, and initial configuration', articles: 12 },
		{ id: '2', title: 'Account & Billing', icon: FileQuestion, desc: 'Plans, pricing, and managing your subscription', articles: 8 },
		{ id: '3', title: 'Integrations', icon: LifeBuoy, desc: 'Connect with third-party tools and platforms', articles: 24 },
		{ id: '4', title: 'Troubleshooting', icon: MessageCircle, desc: 'Common issues and how to resolve them', articles: 15 }
	];

	const ARTICLES = [
		{ title: 'How to reset your password', views: '2.4k' },
		{ title: 'Understanding role-based access control (RBAC)', views: '1.8k' },
		{ title: 'Connecting your custom domain', views: '1.2k' },
		{ title: 'Configuring webhook endpoints', views: '950' },
		{ title: 'Upgrading your pricing plan', views: '840' }
	];
</script>

<div class="space-y-8">
	<!-- Hero -->
	<div class="rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background p-8 md:p-12 text-center">
		<h1 class="text-3xl font-bold tracking-tight mb-4">How can we help?</h1>
		<div class="max-w-xl mx-auto relative">
			<Search class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
			<input
				type="text"
				placeholder="Search for articles, guides, and troubleshooting…"
				class="w-full h-12 rounded-full border border-border bg-background pl-11 pr-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
			/>
		</div>
	</div>

	<!-- Categories -->
	<div class="grid md:grid-cols-2 gap-4">
		{#each CATEGORIES as cat}
			<Card class="p-6 hover:border-primary/50 cursor-pointer transition-colors group">
				<div class="flex items-start gap-4">
					<div class="h-10 w-10 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
						<cat.icon class="h-5 w-5" />
					</div>
					<div>
						<h3 class="font-semibold text-lg">{cat.title}</h3>
						<p class="text-sm text-muted-foreground mt-1 mb-2">{cat.desc}</p>
						<span class="text-xs font-medium text-primary">{cat.articles} articles</span>
					</div>
				</div>
			</Card>
		{/each}
	</div>

	<!-- Popular -->
	<div>
		<h2 class="text-xl font-semibold mb-4">Popular articles</h2>
		<Card class="p-0 overflow-hidden divide-y divide-border">
			{#each ARTICLES as a}
				<a href="#article" class="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
					<span class="font-medium text-sm">{a.title}</span>
					<div class="flex items-center gap-3 text-sm text-muted-foreground">
						<span>{a.views} views</span>
						<ArrowRight class="h-4 w-4" />
					</div>
				</a>
			{/each}
		</Card>
	</div>

	<!-- Contact CTA -->
	<Card class="bg-muted/30 flex flex-col sm:flex-row items-center justify-between gap-6 p-6">
		<div>
			<h3 class="font-semibold text-lg">Still need help?</h3>
			<p class="text-sm text-muted-foreground mt-1">Our support team is available 24/7 to assist you.</p>
		</div>
		<div class="flex gap-3 w-full sm:w-auto shrink-0">
			<Button variant="outline" class="w-full sm:w-auto" onclick={() => toast.info('Ticket', 'Ticket form opened.')}>Open a ticket</Button>
			<Button class="w-full sm:w-auto" onclick={() => toast.success('Live chat', 'Connecting you to an agent...')}>Chat with us</Button>
		</div>
	</Card>
</div>
