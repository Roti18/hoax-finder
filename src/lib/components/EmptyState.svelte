<script lang="ts">
	import SearchX from '@lucide/svelte/icons/search-x';
	let { query = '' }: { query?: string } = $props();
</script>

<div class="flex flex-col items-center justify-center px-4 py-24 text-center">
	<div
		class="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100"
	>
		<SearchX class="h-8 w-8 text-slate-400" />
	</div>
	<h3 class="mb-2 text-xl font-bold text-slate-900">Hasil tidak ditemukan</h3>
	<p class="max-w-md text-slate-500">
		Kami tidak dapat menemukan klarifikasi hoaks yang cocok dengan kata kunci "{query}". Coba
		gunakan kata kunci yang lebih umum atau periksa ejaan Anda.
	</p>
</div>
