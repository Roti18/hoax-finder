<script lang="ts">
	import Search from '@lucide/svelte/icons/search';
	import X from '@lucide/svelte/icons/x';

	let {
		value = $bindable(''),
		onSearch,
		onClear
	}: { value?: string; onSearch: () => void; onClear: () => void } = $props();
</script>

<div class="group relative mx-auto w-full max-w-3xl">
	<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
		<Search class="h-5 w-5 text-slate-400 transition-colors group-focus-within:text-slate-800" />
	</div>

	<input
		type="text"
		bind:value
		onkeydown={(e) => e.key === 'Enter' && onSearch()}
		placeholder="Cari klasifikasi hoaks..."
		class="w-full rounded-lg border border-slate-300 bg-white py-4 pr-24 pl-12 text-lg text-slate-900 shadow-sm transition-all placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-red-600 focus:outline-none"
	/>

	<div class="absolute inset-y-0 right-0 flex items-center space-x-1 pr-2">
		{#if value}
			<button
				type="button"
				onclick={onClear}
				class="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
				title="Hapus pencarian"
			>
				<X class="h-5 w-5" />
			</button>
		{/if}
		<button
			type="button"
			onclick={onSearch}
			class="rounded-md bg-red-600 px-4 py-2 font-medium text-white shadow-sm transition-all hover:bg-red-700"
		>
			Cari Fakta
		</button>
	</div>
</div>
