<script lang="ts">
	import { cn } from '$lib/utils';
	import { Upload, X, ImageIcon } from '@lucide/svelte';
	import { toast } from '$lib/stores/toast.svelte';

	type Props = {
		value?: string;        // base64 data URL or remote URL
		label?: string;
		accept?: string;       // e.g. 'image/png,image/jpeg'
		maxSizeMB?: number;
		class?: string;
		/** Shape of the upload zone */
		variant?: 'square' | 'wide';
	};

	let {
		value = $bindable(''),
		label = 'Upload Image',
		accept = 'image/png,image/jpeg,image/webp,image/svg+xml',
		maxSizeMB = 5,
		class: cls,
		variant = 'wide'
	}: Props = $props();

	let isDragging = $state(false);
	let fileInput: HTMLInputElement;

	const sizeClass = variant === 'square' ? 'aspect-square w-40' : 'h-48 w-full';

	function handleFiles(files: FileList | null) {
		if (!files || files.length === 0) return;
		const file = files[0];

		// Validate type
		if (!file.type.startsWith('image/')) {
			toast.danger('Invalid file', 'Please select an image file.');
			return;
		}

		// Validate size
		const sizeMB = file.size / (1024 * 1024);
		if (sizeMB > maxSizeMB) {
			toast.danger('File too large', `Max size is ${maxSizeMB}MB.`);
			return;
		}

		// Convert to base64 (template mode — in production, upload to server)
		const reader = new FileReader();
		reader.onload = () => {
			value = reader.result as string;
		};
		reader.readAsDataURL(file);
	}

	function onDrop(e: DragEvent) {
		e.preventDefault();
		isDragging = false;
		handleFiles(e.dataTransfer?.files ?? null);
	}

	function onDragOver(e: DragEvent) {
		e.preventDefault();
		isDragging = true;
	}

	function onDragLeave() {
		isDragging = false;
	}

	function onFileChange(e: Event) {
		handleFiles((e.target as HTMLInputElement).files);
	}

	function clear(e: Event) {
		e.preventDefault();
		e.stopPropagation();
		value = '';
		if (fileInput) fileInput.value = '';
	}

	function openPicker() {
		fileInput?.click();
	}
</script>

<div class={cn('space-y-1.5', cls)}>
	{#if label}
		<label class="text-sm font-medium leading-none">{label}</label>
	{/if}

	<input
		bind:this={fileInput}
		type="file"
		{accept}
		class="hidden"
		onchange={onFileChange}
	/>

	{#if value}
		<!-- Preview with remove button -->
		<div class={cn('relative group rounded-lg overflow-hidden border border-border bg-muted/30', sizeClass)}>
			<img src={value} alt="Preview" class="h-full w-full object-cover" />
			<button
				type="button"
				class="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
				onclick={clear}
				aria-label="Remove image"
			>
				<X class="h-4 w-4" />
			</button>
			<button
				type="button"
				class="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
				onclick={openPicker}
				aria-label="Change image"
			>
				<Upload class="h-3.5 w-3.5" />
			</button>
		</div>
		<p class="text-xs text-muted-foreground">Click to change. Max {maxSizeMB}MB.</p>
	{:else}
		<!-- Drop zone -->
		<button
			type="button"
			class={cn(
				'flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed transition-colors w-full',
				sizeClass,
				isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/30'
			)}
			ondrop={onDrop}
			ondragover={onDragOver}
			ondragleave={onDragLeave}
			onclick={openPicker}
		>
			<div class="flex flex-col items-center gap-2 text-muted-foreground">
				{#if isDragging}
					<Upload class="h-7 w-7 text-primary" />
				{:else}
					<ImageIcon class="h-7 w-7" />
				{/if}
				<span class="text-xs font-medium">
					{isDragging ? 'Drop image here' : 'Click or drag image'}
				</span>
				<span class="text-[10px] text-muted-foreground/60">
					PNG, JPG, WebP, SVG · max {maxSizeMB}MB
				</span>
			</div>
		</button>
	{/if}
</div>
