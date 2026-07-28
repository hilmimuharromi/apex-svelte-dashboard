<script lang="ts">
	import { money, compact } from '$lib/utils';
	import { Package, TrendingUp, Archive, Star, Pencil, Plus, FlaskConical, Baby, ShieldCheck } from '@lucide/svelte';
	import { StatCard, Card, Badge, Button, Input, Select, FormField, Modal, RichTextEditor, ImageUpload, Checkbox, Textarea } from '$lib/ui';
	import { toast } from '$lib/stores/toast.svelte';
	import { generateProducts } from '$lib/data/mock';
	import type { Product } from '$lib/types/catalog';

	const ALL = $state(generateProducts(40));

	let search = $state('');
	let statusFilter = $state('All');
	let categoryFilter = $state('All');
	let page = $state(1);
	const PAGE_SIZE = 8;

	// Extract unique categories dynamically based on actual catalog
	const categories = $derived(['All', ...new Set(ALL.map((p) => p.category))]);

	const filtered = $derived.by(() => {
		let rows = ALL;
		if (search.trim()) {
			const q = search.toLowerCase();
			rows = rows.filter((p) => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q));
		}
		if (statusFilter !== 'All') rows = rows.filter((p) => p.status === statusFilter);
		if (categoryFilter !== 'All') rows = rows.filter((p) => p.category === categoryFilter);
		return rows;
	});

	const totalPages = $derived(Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)));
	const rows = $derived(filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE));

	$effect(() => {
		filtered;
		page = 1;
	});

	const STATUS_VARIANT: Record<Product['status'], 'success' | 'default' | 'danger'> = {
		Active: 'success',
		Draft: 'default',
		Archived: 'danger'
	};

	// ── Add/Edit Page Modal State ──
	let modalOpen = $state(false);
	let editingProduct: Product | null = $state(null);

	let formData = $state({
		name: '',
		category: 'Sunscreen',
		price: 0,
		stock: 0,
		status: 'Active' as Product['status'],
		bpomNumber: '',
		ageRange: '0 bln+',
		skinType: [] as string[],
		ingredients: '',
		description: '',
		image: ''
	});

	function slugify(text: string): string {
		return text
			.toString()
			.toLowerCase()
			.replace(/\s+/g, '-')
			.replace(/[^\w\-]+/g, '')
			.replace(/\-\-+/g, '-')
			.replace(/^-+/, '')
			.replace(/-+$/, '');
	}

	function openAdd() {
		editingProduct = null;
		formData = {
			name: '',
			category: 'Sunscreen',
			price: 0,
			stock: 0,
			status: 'Active',
			bpomNumber: '',
			ageRange: '0 bln+',
			skinType: [],
			ingredients: '',
			description: '',
			image: ''
		};
		modalOpen = true;
	}

	function openEdit(p: Product) {
		editingProduct = p;
		formData = {
			name: p.name,
			category: p.category,
			price: p.variants && p.variants.length > 0 ? Math.min(...p.variants.map((v) => v.price)) : p.price,
			stock: p.stock,
			status: p.status,
			bpomNumber: p.bpomNumber || '',
			ageRange: p.ageRange || '0 bln+',
			skinType: p.skinType ? [...p.skinType] : [],
			ingredients: p.ingredients || '',
			description: p.description || '',
			image: p.images && p.images.length > 0 ? p.images[0] : ''
		};
		modalOpen = true;
	}

	function saveProduct() {
		if (!formData.name.trim()) {
			toast.danger('Validation', 'Product name is required.');
			return;
		}

		const slug = slugify(formData.name);
		const basePrice = Number(formData.price) || 0;
		const totalStock = Number(formData.stock) || 0;
		const images = formData.image
			? [formData.image]
			: [`https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(slug)}`];

		if (editingProduct) {
			editingProduct.name = formData.name;
			editingProduct.slug = slug;
			editingProduct.category = formData.category;
			editingProduct.shortDescription = formData.description.replace(/<[^>]+>/g, '').slice(0, 80) + '...';
			editingProduct.description = formData.description;
			editingProduct.images = images;
			editingProduct.status = formData.status;
			editingProduct.bpomNumber = formData.bpomNumber;
			editingProduct.ageRange = formData.ageRange;
			editingProduct.skinType = [...formData.skinType];
			editingProduct.ingredients = formData.ingredients;
			editingProduct.price = basePrice;
			editingProduct.stock = totalStock;

			if (editingProduct.variants && editingProduct.variants.length > 0) {
				editingProduct.variants[0].price = basePrice;
				editingProduct.variants[0].stock = totalStock;
			} else {
				editingProduct.variants = [
					{
						id: `${editingProduct.id}-v0`,
						name: 'Standard',
						sku: `SKU-${slug.toUpperCase()}-STD`,
						price: basePrice,
						stock: totalStock
					}
				];
			}
			toast.success('Updated', `${formData.name} has been updated.`);
		} else {
			const id = `PRD-${(ALL.length + 1).toString().padStart(3, '0')}`;
			const newProduct: Product = {
				id,
				name: formData.name,
				slug,
				category: formData.category,
				shortDescription: formData.description.replace(/<[^>]+>/g, '').slice(0, 80) + '...',
				description: formData.description,
				images,
				status: formData.status,
				ingredients: formData.ingredients,
				bpomNumber: formData.bpomNumber,
				ageRange: formData.ageRange,
				skinType: [...formData.skinType],
				price: basePrice,
				stock: totalStock,
				sales: 0,
				rating: 5.0,
				reviews: 0,
				createdAt: new Date().toISOString(),
				variants: [
					{
						id: `${id}-v0`,
						name: 'Standard',
						sku: `SKU-${slug.toUpperCase()}-STD`,
						price: basePrice,
						stock: totalStock
					}
				]
			};
			ALL.unshift(newProduct);
			toast.success('Created', `${formData.name} added to catalog.`);
		}
		modalOpen = false;
	}
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-semibold tracking-tight">Products</h1>
			<p class="mt-1 text-sm text-muted-foreground">{ALL.length} products in catalog</p>
		</div>
		<Button onclick={openAdd}><Plus class="mr-2 h-4 w-4" /> Add Product</Button>
	</div>

	<div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
		<StatCard label="Total Products" value={ALL.length} icon={Package} />
		<StatCard label="Active" value={ALL.filter((p) => p.status === 'Active').length} icon={Star} />
		<StatCard label="Total Sales" value={compact(ALL.reduce((s, p) => s + p.sales, 0))} icon={TrendingUp} />
		<StatCard label="Archived" value={ALL.filter((p) => p.status === 'Archived').length} icon={Archive} />
	</div>

	<!-- Filters -->
	<div class="flex flex-wrap items-center gap-3">
		<Input class="max-w-xs" placeholder="Search products…" bind:value={search} />
		<Select bind:value={categoryFilter} class="w-40">
			{#each categories as c}
				<option value={c}>{c}</option>
			{/each}
		</Select>
		<Select bind:value={statusFilter} class="w-36">
			{#each ['All', 'Active', 'Draft', 'Archived'] as s}
				<option value={s}>{s}</option>
			{/each}
		</Select>
		{#if search || statusFilter !== 'All' || categoryFilter !== 'All'}
			<Button variant="ghost" size="sm" onclick={() => { search = ''; statusFilter = 'All'; categoryFilter = 'All'; }}>Clear</Button>
		{/if}
		<span class="ml-auto self-center text-sm text-muted-foreground">{filtered.length} results</span>
	</div>

	<!-- Product Cards Grid -->
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
		{#each rows as p (p.id)}
			<div
				role="button"
				tabindex="0"
				class="text-left outline-none block h-full focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-xl"
				onclick={() => openEdit(p)}
				onkeydown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault();
						openEdit(p);
					}
				}}
			>
				<Card class="overflow-hidden group cursor-pointer flex flex-col h-full">
					<div class="relative aspect-video bg-muted overflow-hidden">
						{#if p.images && p.images.length > 0}
							<img src={p.images[0]} alt={p.name} class="h-full w-full object-cover transition-transform group-hover:scale-105" loading="lazy" />
						{:else}
							<div class="h-full w-full flex items-center justify-center bg-muted text-muted-foreground">
								<Package class="h-8 w-8 opacity-45" />
							</div>
						{/if}
						<div class="absolute top-2 right-2">
							<Badge variant={STATUS_VARIANT[p.status]}>{p.status}</Badge>
						</div>
					</div>
					<div class="p-4 flex-1 flex flex-col justify-between space-y-3">
						<div class="space-y-2">
							<div class="flex items-start justify-between gap-2">
								<div class="min-w-0 flex-1">
									<p class="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">{p.name}</p>
									<p class="text-[10px] text-muted-foreground font-mono">{p.id}</p>
								</div>
								<button
									type="button"
									class="shrink-0 flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
									onclick={(e) => { e.stopPropagation(); openEdit(p); }}
									aria-label="Edit product"
								>
									<Pencil class="h-3.5 w-3.5" />
								</button>
							</div>

							<div class="flex flex-wrap gap-1">
								<Badge variant="outline" class="text-[10px]">{p.category}</Badge>
								{#if p.ageRange}
									<Badge variant="info" class="text-[10px] gap-1">
										<Baby class="h-3 w-3" />
										{p.ageRange}
									</Badge>
								{/if}
								{#if p.bpomNumber}
									<Badge variant="success" class="text-[10px] gap-1">
										<ShieldCheck class="h-3 w-3" />
										{p.bpomNumber}
									</Badge>
								{/if}
							</div>

							{#if p.ingredients}
								<div class="flex items-center gap-1 text-[11px] text-muted-foreground">
									<FlaskConical class="h-3 w-3 shrink-0" />
									<span class="truncate">{p.ingredients}</span>
								</div>
							{/if}
						</div>

						<div class="pt-2 border-t border-border flex items-center justify-between mt-auto">
							<div class="flex flex-col">
								<span class="text-[9px] text-muted-foreground">Price from</span>
								<span class="text-sm font-semibold tabular-nums">
									{money(p.variants && p.variants.length > 0 ? Math.min(...p.variants.map((v) => v.price)) : p.price)}
								</span>
							</div>
							<div class="text-right text-[11px] text-muted-foreground">
								<div>{p.stock.toLocaleString()} stock</div>
								<div>{p.sales.toLocaleString()} sold</div>
							</div>
						</div>
					</div>
				</Card>
			</div>
		{:else}
			<div class="col-span-full text-center py-16 text-muted-foreground">No products found.</div>
		{/each}
	</div>

	<!-- Pagination -->
	{#if totalPages > 1}
		<div class="flex items-center justify-between text-sm border-t border-border pt-4">
			<span class="text-muted-foreground">Page {page} of {totalPages}</span>
			<div class="flex gap-1">
				<Button variant="outline" size="sm" onclick={() => (page = Math.max(1, page - 1))} disabled={page === 1}>Prev</Button>
				{#each Array.from({ length: Math.min(5, totalPages) }, (_, i) => Math.max(1, Math.min(page - 2, totalPages - 4)) + i) as pg}
					<Button variant={pg === page ? 'primary' : 'ghost'} size="sm" onclick={() => (page = pg)}>{pg}</Button>
				{/each}
				<Button variant="outline" size="sm" onclick={() => (page = Math.min(totalPages, page + 1))} disabled={page === totalPages}>Next</Button>
			</div>
		</div>
	{/if}
</div>

<!-- Add/Edit Product Modal -->
<Modal
	bind:open={modalOpen}
	title={editingProduct ? `Edit ${editingProduct.name}` : 'Add Product'}
	description={editingProduct ? 'Update product details below.' : 'Fill in the details for your new product.'}
	maxWidth="2xl"
>
	<div class="space-y-4 max-h-[70vh] overflow-y-auto px-1">
		<ImageUpload label="Product First Image" bind:value={formData.image} />

		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
			<FormField label="Name" required>
				<Input bind:value={formData.name} placeholder="Product name" />
			</FormField>
			<FormField label="Category">
				<Select bind:value={formData.category}>
					{#each ['Sunscreen', 'Lotion', 'Sabun', 'Krim', 'Rambut'] as c}
						<option value={c}>{c}</option>
					{/each}
				</Select>
			</FormField>
		</div>

		<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
			<FormField label="Price (IDR)">
				<Input type="number" bind:value={formData.price} min="0" />
			</FormField>
			<FormField label="Stock">
				<Input type="number" bind:value={formData.stock} min="0" />
			</FormField>
			<FormField label="Status">
				<Select bind:value={formData.status}>
					<option value="Active">Active</option>
					<option value="Draft">Draft</option>
					<option value="Archived">Archived</option>
				</Select>
			</FormField>
		</div>

		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
			<FormField label="BPOM Registration Number">
				<Input bind:value={formData.bpomNumber} placeholder="e.g. BPOM NA182910001" />
			</FormField>
			<FormField label="Age Range">
				<Select bind:value={formData.ageRange}>
					{#each ['0 bln+', '6 bln+', '1 thn+', '3 thn+', 'All Ages'] as a}
						<option value={a}>{a}</option>
					{/each}
				</Select>
			</FormField>
		</div>

		<FormField label="Skin Type">
			<div class="flex flex-wrap gap-3 mt-1">
				{#each ['Sensitive', 'Normal', 'Dry', 'Oily'] as type}
					<div class="flex items-center gap-2 cursor-pointer border border-border rounded-lg px-3 py-1.5 bg-muted/20 hover:bg-muted/40 transition-colors select-none">
						<Checkbox
							checked={formData.skinType.includes(type)}
							onchange={(e) => {
								const checked = (e.target as HTMLInputElement).checked;
								if (checked) {
									if (!formData.skinType.includes(type)) {
										formData.skinType = [...formData.skinType, type];
									}
								} else {
									formData.skinType = formData.skinType.filter((t) => t !== type);
								}
							}}
						/>
						<span class="text-sm font-medium">{type}</span>
					</div>
				{/each}
			</div>
		</FormField>

		<FormField label="Ingredients">
			<Textarea bind:value={formData.ingredients} placeholder="Aqua, Glycerin,..." />
		</FormField>

		<FormField label="Description">
			<RichTextEditor bind:value={formData.description} placeholder="Describe product benefits, how to use..." />
		</FormField>
	</div>

	{#snippet footer()}
		<div class="flex justify-end gap-2">
			<Button variant="ghost" onclick={() => (modalOpen = false)}>Cancel</Button>
			<Button onclick={saveProduct}>{editingProduct ? 'Save Changes' : 'Create Product'}</Button>
		</div>
	{/snippet}
</Modal>
