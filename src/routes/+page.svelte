<script lang="ts">
	import { onMount } from 'svelte';
	import ShieldAlert from '@lucide/svelte/icons/shield-alert';
	import { engine, type DocumentData, type SearchResult } from '$lib/search/engine';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import SearchStats from '$lib/components/SearchStats.svelte';
	import SearchResultCard from '$lib/components/SearchResultCard.svelte';
	import ResultDetailModal from '$lib/components/ResultDetailModal.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import LoadingState from '$lib/components/LoadingState.svelte';
	import { fade, slide } from 'svelte/transition';

	let query = $state('');
	let isSearching = $state(false);
	let hasSearched = $state(false);
	let results: SearchResult[] = $state([]);
	let totalResults = $state(0);
	let currentPage = $state(1);
	let totalPages = $state(1);
	let searchTimeMs = $state(0);
	let isInitializing = $state(true);

	let selectedDocument: DocumentData | null = $state(null);

	onMount(() => {
		// Inisialisasi engine di client-side untuk membangun Index BM25
		setTimeout(() => {
			console.time('Init Engine');
			engine.initialize();
			console.timeEnd('Init Engine');
			isInitializing = false;
		}, 100); // Beri sedikit jeda agar UI render pertama tidak terblokir
	});

	const handleSearch = (page = 1) => {
		if (!query.trim()) return;

		isSearching = true;
		hasSearched = true;

		// Simulasi loading agar transisi UI terlihat mulus
		setTimeout(() => {
			const start = performance.now();
			const response = engine.search(query, page);
			const end = performance.now();

			results = response.results;
			totalResults = response.total;
			currentPage = response.page;
			totalPages = response.totalPages;
			searchTimeMs = end - start;

			isSearching = false;

			// Scroll top slowly
			if (page > 1) {
				window.scrollTo({ top: 0, behavior: 'smooth' });
			}
		}, 150);
	};

	const handleClear = () => {
		query = '';
		results = [];
		totalResults = 0;
		currentPage = 1;
		totalPages = 1;
		hasSearched = false;
	};
</script>

<svelte:head>
	<title>HoaxFinder - Mesin Pencari Klarifikasi Hoaks</title>
</svelte:head>

<div
	class="relative min-h-screen overflow-hidden bg-slate-50 font-sans text-slate-900 selection:bg-red-100 selection:text-red-900"
>
	<!-- Top Navigation Area -->
	<header class="sticky top-0 z-30 w-full border-b border-slate-200 bg-white shadow-sm">
		<div class="mx-auto flex h-16 max-w-5xl items-center gap-3 px-4 sm:px-6">
			<ShieldAlert class="h-6 w-6 text-red-600" />
			<h1 class="text-xl font-bold tracking-tight text-slate-900">HoaxFinder</h1>
		</div>
	</header>

	<main class="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-4 py-12 sm:px-6">
		<!-- Hero Section -->
		<div
			class="mb-10 flex w-full flex-col items-center text-center transition-all duration-500 {hasSearched
				? 'mb-0 h-0 overflow-hidden opacity-0'
				: 'h-auto opacity-100'}"
		>
			<div
				class="mb-6 inline-flex items-center gap-2 rounded-md border border-red-100 bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-700"
			>
				<ShieldAlert class="h-4 w-4" />
				Sistem Temu Kembali Informasi BM25
			</div>
			<h2 class="mb-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
				Temukan Klarifikasi Hoaks
			</h2>
			<p class="max-w-2xl text-lg leading-relaxed text-slate-600">
				Mesin pencari berbasis BM25 untuk menemukan data klarifikasi hoaks resmi dari Kementerian
				Komunikasi dan Digital RI.
			</p>
		</div>

		<!-- Search Section -->
		<div
			class="w-full max-w-3xl {hasSearched ? 'mb-8' : ''} transition-all duration-500"
			class:mt-0={hasSearched}
		>
			<SearchBar bind:value={query} onSearch={() => handleSearch(1)} onClear={handleClear} />
		</div>

		<!-- Initialization Loader -->
		{#if isInitializing}
			<div class="mt-12 flex items-center gap-3 text-slate-500" in:fade>
				<div
					class="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-red-600"
				></div>
				<span class="font-medium">Menyiapkan Database...</span>
			</div>
		{/if}

		<!-- Results Section -->
		{#if hasSearched && !isSearching}
			<div class="w-full max-w-3xl" in:slide={{ duration: 300, axis: 'y' }}>
				<SearchStats count={totalResults} timeMs={searchTimeMs} method="BM25 Ranking" />

				<div class="mt-6 flex flex-col gap-4">
					{#if results.length > 0}
						{#each results as result (result.document.id)}
							<div in:fade={{ duration: 200 }}>
								<SearchResultCard {result} onClick={() => (selectedDocument = result.document)} />
							</div>
						{/each}

						<Pagination {currentPage} {totalPages} onPageChange={(page) => handleSearch(page)} />
					{:else}
						<EmptyState {query} />
					{/if}
				</div>
			</div>
		{/if}

		<!-- Loading State (During Search) -->
		{#if isSearching}
			<div class="mt-12" in:fade={{ duration: 150 }}>
				<LoadingState />
			</div>
		{/if}
	</main>
</div>

<!-- Modal -->
{#if selectedDocument}
	<ResultDetailModal document={selectedDocument} onClose={() => (selectedDocument = null)} />
{/if}
