<script lang="ts">
	import { theme, type AccentColor } from '$lib/stores/theme.svelte';
	import { Modal, Button } from '$lib/ui';
	import { Sun, Moon, Check } from '@lucide/svelte';

	let { open = $bindable() }: { open: boolean } = $props();

	const accents: AccentColor[] = ['emerald', 'blue', 'violet', 'orange', 'pink', 'red'];
</script>

<Modal bind:open title="Customize Theme" description="Pick your preferred mode and accent color." maxWidth="md">
	<div class="space-y-6 py-2">
		<!-- Mode -->
		<div>
			<p class="text-sm font-medium mb-3">Appearance</p>
			<div class="grid grid-cols-2 gap-3">
				<button
					class="flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-colors {theme.mode === 'light' ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted'}"
					onclick={() => theme.setMode('light')}
				>
					<Sun class="h-6 w-6" />
					<span class="text-sm font-medium">Light</span>
				</button>
				<button
					class="flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-colors {theme.mode === 'dark' ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted'}"
					onclick={() => theme.setMode('dark')}
				>
					<Moon class="h-6 w-6" />
					<span class="text-sm font-medium">Dark</span>
				</button>
			</div>
		</div>

		<!-- Accent -->
		<div>
			<p class="text-sm font-medium mb-3">Accent Color</p>
			<div class="flex flex-wrap gap-3">
				{#each accents as accent}
					<button
						class="relative flex h-10 w-10 items-center justify-center rounded-full transition-transform hover:scale-110"
						style="background: {theme.accentOptions[accent].primary}"
						onclick={() => theme.setAccent(accent)}
						aria-label={theme.accentOptions[accent].name}
					>
						{#if theme.accent === accent}
							<Check class="h-5 w-5 text-white" />
						{/if}
					</button>
				{/each}
			</div>
		</div>
	</div>

	{#snippet footer()}
		<Button onclick={() => open = false}>Done</Button>
	{/snippet}
</Modal>
