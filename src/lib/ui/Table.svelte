<script lang="ts" module>
	export type TableColumn<T = Record<string, unknown>> = {
		key: string;
		label: string;
		align?: 'left' | 'right' | 'center';
		width?: string;
		sortable?: boolean;
		cell?: import('svelte').Snippet<[T]>;
	};
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	import { cn } from '$lib/utils';

	type Props = {
		columns: TableColumn<T>[];
		rows: T[];
		rowKey?: (row: T, i: number) => string | number;
		onRowClick?: (row: T) => void;
		class?: string;
		empty?: import('svelte').Snippet;
	};

	let { columns, rows, rowKey, onRowClick, class: cls, empty }: Props = $props();
</script>

<div class={cn('overflow-x-auto rounded-xl border border-border bg-card', cls)}>
	<table class="w-full text-sm">
		<thead class="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
			<tr>
				{#each columns as col}
					<th
						class={cn('px-4 py-3 font-medium', col.align === 'right' && 'text-right', col.align === 'center' && 'text-center')}
						style={col.width ? `width:${col.width}` : undefined}
					>
						{col.label}
					</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#if rows.length === 0}
				<tr>
					<td colspan={columns.length} class="p-8 text-center text-muted-foreground">
						{#if empty}{@render empty()}{:else}No data{/if}
					</td>
				</tr>
			{:else}
				{#each rows as row, i (rowKey ? rowKey(row, i) : i)}
					<tr
						class={cn(
							'border-t border-border transition-colors',
							onRowClick && 'cursor-pointer hover:bg-muted/50'
						)}
						onclick={() => onRowClick?.(row)}
					>
						{#each columns as col}
							<td
								class={cn(
									'px-4 py-3',
									col.align === 'right' && 'text-right tabular',
									col.align === 'center' && 'text-center'
								)}
							>
								{#if col.cell}
									{@render col.cell(row)}
								{:else}
									{row[col.key] ?? ''}
								{/if}
							</td>
						{/each}
					</tr>
				{/each}
			{/if}
		</tbody>
	</table>
</div>
