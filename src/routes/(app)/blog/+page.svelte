<script lang="ts">
	import { Card, Badge, Button, Input, Select, FormField, Modal, RichTextEditor, ImageUpload, StatCard } from '$lib/ui';
	import type { BlogPost } from '$lib/types/catalog';
	import { compact } from '$lib/utils';
	import { toast } from '$lib/stores/toast.svelte';
	import { generateBlogPosts } from '$lib/data/mock';
	import { BookOpen, Plus, Pencil, Eye, Calendar, Tag } from '@lucide/svelte';

	// Initializing blogs from mock data
	const ALL_POSTS = $state(generateBlogPosts());

	let search = $state('');
	let statusFilter = $state('All');

	// Derived lists and stats
	const filtered = $derived.by(() => {
		let list = ALL_POSTS;
		if (search.trim()) {
			const q = search.toLowerCase();
			list = list.filter((p) => p.title.toLowerCase().includes(q));
		}
		if (statusFilter !== 'All') {
			list = list.filter((p) => p.status === statusFilter.toLowerCase());
		}
		return list;
	});

	const statTotal = $derived(ALL_POSTS.length);
	const statPublished = $derived(ALL_POSTS.filter((p) => p.status === 'published').length);
	const statDrafts = $derived(ALL_POSTS.filter((p) => p.status === 'draft').length);
	const statViews = $derived(ALL_POSTS.reduce((sum, p) => sum + p.views, 0));

	// Modal and form states
	let modalOpen = $state(false);
	let editingPost: BlogPost | null = $state(null);

	let formData = $state({
		title: '',
		slug: '',
		excerpt: '',
		coverImage: '',
		category: '',
		tagsString: '',
		content: '',
		status: 'draft' as 'published' | 'draft',
		author: ''
	});

	function openAdd() {
		editingPost = null;
		formData = {
			title: '',
			slug: '',
			excerpt: '',
			coverImage: '',
			category: 'Tips',
			tagsString: '',
			content: '',
			status: 'draft',
			author: 'Tim Miromi'
		};
		modalOpen = true;
	}

	function openEdit(post: BlogPost) {
		editingPost = post;
		formData = {
			title: post.title,
			slug: post.slug,
			excerpt: post.excerpt,
			coverImage: post.coverImage,
			category: post.category,
			tagsString: post.tags.join(', '),
			content: post.content,
			status: post.status,
			author: post.author
		};
		modalOpen = true;
	}

	// Generate a url-friendly slug from title
	function syncSlug() {
		if (!editingPost && formData.title) {
			formData.slug = formData.title
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, '-')
				.replace(/(^-|-$)+/g, '');
		}
	}

	function savePost() {
		if (!formData.title.trim()) {
			toast.danger('Validation', 'Post title is required.');
			return;
		}
		if (!formData.excerpt.trim()) {
			toast.danger('Validation', 'Excerpt is required.');
			return;
		}

		const tagsArray = formData.tagsString
			.split(',')
			.map((t) => t.trim())
			.filter(Boolean);

		const today = new Date().toISOString().slice(0, 10);

		if (editingPost) {
			editingPost.title = formData.title;
			editingPost.slug = formData.slug;
			editingPost.excerpt = formData.excerpt;
			editingPost.coverImage = formData.coverImage;
			editingPost.category = formData.category;
			editingPost.tags = tagsArray;
			editingPost.content = formData.content;
			editingPost.author = formData.author;
			
			// If changed status to published and doesn't have a date yet
			if (formData.status === 'published' && editingPost.status === 'draft') {
				editingPost.publishedAt = today;
			}
			editingPost.status = formData.status;

			toast.success('Updated', `"${formData.title}" updated successfully.`);
		} else {
			const newPost: BlogPost = {
				id: `BLG-${Date.now().toString().slice(-4)}`,
				title: formData.title,
				slug: formData.slug,
				excerpt: formData.excerpt,
				coverImage: formData.coverImage || 'https://api.dicebear.com/7.x/shapes/svg?seed=blog-new&backgroundColor=10b981',
				category: formData.category,
				tags: tagsArray,
				content: formData.content,
				status: formData.status,
				author: formData.author,
				publishedAt: formData.status === 'published' ? today : '',
				views: 0
			};
			ALL_POSTS.unshift(newPost);
			toast.success('Created', `"${formData.title}" added to posts.`);
		}
		modalOpen = false;
	}
</script>

<div class="space-y-6">
	<!-- Page Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-semibold tracking-tight">Blog Articles</h1>
			<p class="mt-1 text-sm text-muted-foreground">Manage parenting tips, product education, and articles.</p>
		</div>
		<Button onclick={openAdd}><Plus class="h-4 w-4" /> Write Article</Button>
	</div>

	<!-- Stats Grid -->
	<div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
		<StatCard label="Total Posts" value={statTotal} icon={BookOpen} />
		<StatCard label="Published" value={statPublished} icon={BookOpen} />
		<StatCard label="Drafts" value={statDrafts} icon={BookOpen} />
		<StatCard label="Total Views" value={compact(statViews)} icon={Eye} />
	</div>

	<!-- Filter and Search controls -->
	<Card class="p-4">
		<div class="flex flex-col sm:flex-row gap-4 items-center justify-between">
			<div class="w-full sm:max-w-xs">
				<Input bind:value={search} placeholder="Search by title..." />
			</div>
			<div class="flex gap-2 w-full sm:w-auto">
				<Select bind:value={statusFilter} class="min-w-[120px]">
					<option value="All">All Status</option>
					<option value="published">Published</option>
					<option value="draft">Draft</option>
				</Select>
			</div>
		</div>
	</Card>

	<!-- Blog Card Grid -->
	{#if filtered.length === 0}
		<div class="rounded-xl border border-border bg-card p-12 text-center text-muted-foreground">
			No articles match your criteria.
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each filtered as post (post.id)}
				<Card class="overflow-hidden flex flex-col h-full bg-card">
					{#snippet header()}
						<div class="relative h-44 w-full -mx-5 -mt-5 mb-4 overflow-hidden border-b border-border bg-muted flex items-center justify-center">
							{#if post.coverImage}
								<img src={post.coverImage} alt={post.title} class="h-full w-full object-cover transition-transform hover:scale-105" />
							{:else}
								<BookOpen class="h-10 w-10 text-muted-foreground" />
							{/if}
							<div class="absolute top-2 right-2">
								<Badge variant={post.status === 'published' ? 'success' : 'default'}>
									{post.status.toUpperCase()}
								</Badge>
							</div>
						</div>
						<div class="flex items-center justify-between">
							<Badge variant="primary">{post.category}</Badge>
							<span class="text-xs text-muted-foreground font-mono">{post.id}</span>
						</div>
						<h3 class="mt-2 text-lg font-semibold line-clamp-2 text-card-foreground leading-snug">{post.title}</h3>
					{/snippet}

					<div class="flex-1 flex flex-col justify-between space-y-4">
						<p class="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{post.excerpt}</p>

						<div class="flex flex-wrap gap-1.5 pt-1">
							{#each post.tags as tag}
								<span class="inline-flex items-center gap-1 text-[11px] text-muted-foreground bg-muted/65 px-2 py-0.5 rounded-md border border-border/40">
									<Tag class="h-2.5 w-2.5" /> {tag}
								</span>
							{/each}
						</div>

						<div class="border-t border-border/60 pt-4 mt-auto space-y-2">
							<div class="flex items-center justify-between text-xs text-muted-foreground">
								<span>by <span class="font-medium text-foreground">{post.author}</span></span>
								<span class="flex items-center gap-1 font-mono"><Eye class="h-3.5 w-3.5" /> {compact(post.views)}</span>
							</div>
							<div class="flex items-center justify-between text-xs text-muted-foreground pt-1">
								<span class="flex items-center gap-1"><Calendar class="h-3.5 w-3.5" /> {post.publishedAt || 'Draft'}</span>
								<Button variant="outline" size="sm" class="h-7 px-2.5" onclick={() => openEdit(post)}>
									<Pencil class="h-3 w-3 mr-1" /> Edit
								</Button>
							</div>
						</div>
					</div>
				</Card>
			{/each}
		</div>
	{/if}
</div>

<!-- Add/Edit Article Modal -->
<Modal
	bind:open={modalOpen}
	title={editingPost ? 'Edit Article' : 'Write New Article'}
	description="Share guidelines, tips and care routines with parents."
	maxWidth="2xl"
>
	<div class="space-y-4">
		<ImageUpload label="Cover Image" bind:value={formData.coverImage} />

		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
			<FormField label="Title" required>
				<Input bind:value={formData.title} placeholder="e.g. 7 Tips Memilih Sunscreen Anak" oninput={syncSlug} />
			</FormField>
			<FormField label="Slug (URL)" required>
				<Input bind:value={formData.slug} placeholder="e.g. tips-memilih-sunscreen" />
			</FormField>
		</div>

		<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
			<FormField label="Category">
				<Input bind:value={formData.category} placeholder="e.g. Tips, Parenting, Edukasi" />
			</FormField>
			<FormField label="Tags (comma-separated)">
				<Input bind:value={formData.tagsString} placeholder="e.g. sunscreen, bayi, routine" />
			</FormField>
			<FormField label="Author">
				<Input bind:value={formData.author} placeholder="Tim Miromi or Dr. Name" />
			</FormField>
		</div>

		<FormField label="Excerpt" description="A short summary shown in the blog archive list.">
			<Input bind:value={formData.excerpt} placeholder="Brief summary of the article..." />
		</FormField>

		<FormField label="Content">
			<RichTextEditor bind:value={formData.content} placeholder="Write the HTML content here..." />
		</FormField>

		<FormField label="Publishing Status">
			<Select bind:value={formData.status}>
				<option value="draft">Draft</option>
				<option value="published">Published</option>
			</Select>
		</FormField>
	</div>

	{#snippet footer()}
		<Button variant="ghost" onclick={() => (modalOpen = false)}>Cancel</Button>
		<Button onclick={savePost}>{editingPost ? 'Save Changes' : 'Publish Article'}</Button>
	{/snippet}
</Modal>
