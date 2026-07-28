<script lang="ts">
	let { children } = $props();
</script>

<div class="min-h-screen flex items-center justify-center bg-muted/30 p-4">
	{@render children()}
</div>
