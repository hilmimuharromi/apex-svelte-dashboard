<script lang="ts">
	import { Card } from '$lib/ui';
	import { ChevronRight } from '@lucide/svelte';

	const nav = [
		{ title: 'Getting Started', links: ['Introduction', 'Installation', 'Architecture', 'Configuration'] },
		{ title: 'Components', links: ['Buttons & Inputs', 'Cards & Layout', 'Data Display', 'Charts'] },
		{ title: 'API Reference', links: ['Authentication', 'Endpoints', 'Webhooks', 'Errors'] }
	];
</script>

<div class="grid lg:grid-cols-[240px_1fr] gap-8 items-start">
	<!-- Sidebar Nav -->
	<aside class="sticky top-24 hidden lg:block space-y-6">
		{#each nav as section}
			<div>
				<h4 class="font-semibold text-sm mb-3 tracking-tight">{section.title}</h4>
				<ul class="space-y-1">
					{#each section.links as link, i}
						{@const active = section.title === 'Getting Started' && i === 1}
						<li>
							<a
								href="#doc"
								class="block px-3 py-1.5 rounded-md text-sm transition-colors {active ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}"
							>
								{link}
							</a>
						</li>
					{/each}
				</ul>
			</div>
		{/each}
	</aside>

	<!-- Content -->
	<div class="prose prose-sm md:prose-base prose-slate dark:prose-invert max-w-none">
		<div class="flex items-center gap-2 text-sm text-muted-foreground mb-6 not-prose">
			<span>Docs</span><ChevronRight class="h-3 w-3" /><span>Getting Started</span><ChevronRight class="h-3 w-3" /><span class="text-foreground">Installation</span>
		</div>

		<h1>Installation</h1>
		<p class="lead">Learn how to install and set up Apex Dashboard in your local development environment.</p>

		<h2>Prerequisites</h2>
		<p>Before you begin, ensure you have the following installed:</p>
		<ul>
			<li>Node.js 18.0.0 or later</li>
			<li>pnpm (recommended), npm, or yarn</li>
			<li>Git</li>
		</ul>

		<h2>Quick Start</h2>
		<p>The fastest way to get started is by cloning the repository and installing dependencies.</p>

		<pre><code>git clone https://github.com/apex-dev/dashboard.git
cd dashboard
pnpm install
pnpm dev</code></pre>

		<Card class="my-6 not-prose p-4 bg-info/10 border-info/20">
			<h4 class="text-info font-semibold flex items-center gap-2 mb-2">
				<div class="h-4 w-4 shrink-0 rounded-full bg-info text-info-foreground inline-flex items-center justify-center text-[10px] font-bold">i</div>
				Note
			</h4>
			<p class="text-sm text-info/90">The development server typically runs on <code class="bg-info/20 px-1 rounded">http://localhost:5173</code>. Port might vary if 5173 is already in use.</p>
		</Card>

		<h2>Project Structure</h2>
		<p>Apex Dashboard follows standard SvelteKit conventions with a few additions for UI primitives:</p>

		<table class="not-prose w-full text-sm mt-4 border-collapse">
			<thead class="bg-muted/40 text-left border-b border-border">
				<tr>
					<th class="p-3 font-medium">Directory</th>
					<th class="p-3 font-medium">Description</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-border">
				<tr>
					<td class="p-3 font-mono text-xs">src/lib/ui</td>
					<td class="p-3 text-muted-foreground">Core UI primitives (Buttons, Cards, Forms)</td>
				</tr>
				<tr>
					<td class="p-3 font-mono text-xs">src/lib/charts</td>
					<td class="p-3 text-muted-foreground">Custom SVG chart wrappers</td>
				</tr>
				<tr>
					<td class="p-3 font-mono text-xs">src/routes</td>
					<td class="p-3 text-muted-foreground">Page templates and routing logic</td>
				</tr>
			</tbody>
		</table>

		<h2 id="next-steps">Next Steps</h2>
		<p>Now that you have the dashboard running, check out:</p>
		<ul>
			<li><a href="#arch">Architecture Overview</a></li>
			<li><a href="#config">Configuration Guide</a></li>
		</ul>
	</div>
</div>
