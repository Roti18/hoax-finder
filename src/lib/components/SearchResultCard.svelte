<script lang="ts">
	import Calendar from '@lucide/svelte/icons/calendar';
	import Tag from '@lucide/svelte/icons/tag';
	import FileText from '@lucide/svelte/icons/file-text';
	import type { DocumentData } from '../search/engine';

	let {
		result,
		onClick
	}: { result: { document: DocumentData; score: number }; onClick: () => void } = $props();

	// Helper to format date
	const formatDate = (dateString: string) => {
		try {
			return new Date(dateString).toLocaleDateString('id-ID', {
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			});
		} catch {
			return dateString;
		}
	};
</script>

<button
	class="group flex w-full flex-col gap-3 rounded-lg border-y border-r border-l-4 border-slate-200 border-l-red-600 bg-white p-6 text-left transition-all hover:border-y-slate-300 hover:border-r-slate-300 hover:shadow-md"
	onclick={onClick}
>
	<div class="flex w-full items-start justify-between gap-4">
		<h3
			class="text-xl leading-tight font-bold text-slate-900 transition-colors group-hover:text-red-700"
		>
			{result.document.title}
		</h3>
		<div
			class="flex-shrink-0 rounded border border-slate-200 bg-slate-100 px-2.5 py-1 font-mono text-xs font-medium text-slate-600"
			title="Skor BM25 Mentah"
		>
			{result.score.toFixed(3)}
		</div>
	</div>

	<p class="line-clamp-2 leading-relaxed text-slate-600">
		{result.document.excerpt || result.document.body_text.slice(0, 150) + '...'}
	</p>

	<div class="mt-3 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
		{#if result.document.published_at}
			<div class="flex items-center gap-1.5">
				<Calendar class="h-3.5 w-3.5" />
				<span>{formatDate(result.document.published_at)}</span>
			</div>
		{/if}

		{#if result.document.category}
			<div class="flex items-center gap-1.5">
				<FileText class="h-3.5 w-3.5" />
				<span>{result.document.category}</span>
			</div>
		{/if}

		{#if result.document.topics}
			<div
				class="flex items-center gap-1.5 rounded border border-red-100 bg-red-50 px-2 py-0.5 text-red-700"
			>
				<Tag class="h-3 w-3" />
				<span>{result.document.topics}</span>
			</div>
		{/if}
	</div>
</button>
