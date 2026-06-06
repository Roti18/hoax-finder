<script lang="ts">
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';

	let {
		currentPage = 1,
		totalPages = 1,
		onPageChange
	}: {
		currentPage: number;
		totalPages: number;
		onPageChange: (page: number) => void;
	} = $props();

	// Calculate visible page numbers
	let visiblePages = $derived.by(() => {
		const delta = 1;
		const range = [];
		for (
			let i = Math.max(2, currentPage - delta);
			i <= Math.min(totalPages - 1, currentPage + delta);
			i++
		) {
			range.push(i);
		}
		if (currentPage - delta > 2) range.unshift('...');
		if (currentPage + delta < totalPages - 1) range.push('...');

		const pages: (number | string)[] = [1];
		if (totalPages > 1) {
			pages.push(...range);
			if (pages[pages.length - 1] !== totalPages) {
				pages.push(totalPages);
			}
		}
		return pages;
	});
</script>

{#if totalPages > 1}
	<div class="mt-8 mb-4 flex items-center justify-center gap-2">
		<button
			type="button"
			disabled={currentPage === 1}
			onclick={() => onPageChange(currentPage - 1)}
			class="rounded-md border border-slate-200 bg-white p-2 text-slate-600 shadow-sm transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
		>
			<ChevronLeft class="h-5 w-5" />
		</button>

		<div class="flex items-center gap-1">
			{#each visiblePages as pageNum}
				{#if pageNum === '...'}
					<span class="px-2 text-slate-400">...</span>
				{:else}
					<button
						type="button"
						onclick={() => typeof pageNum === 'number' && onPageChange(pageNum)}
						class="h-10 min-w-[40px] rounded-md border px-2 text-sm font-medium shadow-sm transition-colors {currentPage ===
						pageNum
							? 'border-red-600 bg-red-600 text-white'
							: 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}"
					>
						{pageNum}
					</button>
				{/if}
			{/each}
		</div>

		<button
			type="button"
			disabled={currentPage === totalPages}
			onclick={() => onPageChange(currentPage + 1)}
			class="rounded-md border border-slate-200 bg-white p-2 text-slate-600 shadow-sm transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
		>
			<ChevronRight class="h-5 w-5" />
		</button>
	</div>
{/if}
