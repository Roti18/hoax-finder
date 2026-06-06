<script lang="ts">
	import Clock from '@lucide/svelte/icons/clock';
	import Layers from '@lucide/svelte/icons/layers';
	import Zap from '@lucide/svelte/icons/zap';

	let {
		count = 0,
		timeMs = 0,
		method = 'BM25'
	}: { count?: number; timeMs?: number; method?: string } = $props();
</script>

<div
	class="flex flex-wrap items-center gap-4 border-b border-slate-200 py-3 text-sm text-slate-500"
>
	<div class="flex items-center gap-1.5">
		<Layers class="h-4 w-4" />
		<span>{count} hasil ditemukan</span>
	</div>

	<div class="h-1 w-1 rounded-full bg-slate-300"></div>

	<div class="flex items-center gap-1.5">
		<Clock class="h-4 w-4" />
		<span>Waktu: {timeMs.toFixed(2)} ms</span>
	</div>

	<div class="h-1 w-1 rounded-full bg-slate-300"></div>
</div>
