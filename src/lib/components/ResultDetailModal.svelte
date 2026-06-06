<script lang="ts">
	import X from '@lucide/svelte/icons/x';
	import Calendar from '@lucide/svelte/icons/calendar';
	import Tag from '@lucide/svelte/icons/tag';
	import FileText from '@lucide/svelte/icons/file-text';
	import Link from '@lucide/svelte/icons/link';
	import type { DocumentData } from '../search/engine';

	let { document = null, onClose }: { document?: DocumentData | null; onClose: () => void } =
		$props();

	const formatDate = (dateString: string) => {
		try {
			return new Date(dateString).toLocaleDateString('id-ID', {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
				hour: '2-digit',
				minute: '2-digit'
			});
		} catch {
			return dateString;
		}
	};

	// Handle escape key
	const handleKeydown = (e: KeyboardEvent) => {
		if (e.key === 'Escape' && document) {
			onClose();
		}
	};

	let parsedContent = $derived.by(() => {
		if (!document) return { explanation: '', facts: '', category: '', links: [] };

		let text = document?.body_text || '';

		let linkCounterMatch = text.match(/Link\s*[Cc]ounter\s*:/i);
		let mainText = text;
		let linksText = '';

		if (linkCounterMatch) {
			mainText = text.substring(0, linkCounterMatch.index).trim();
			linksText = text.substring(linkCounterMatch.index! + linkCounterMatch[0].length).trim();
		}

		let explanation = mainText;
		let facts = '';

		explanation = explanation.replace(/^Penjelasan\s*:/i, '').trim();

		let faktanyaMatch = explanation.match(/Faktanya\s*,/i);
		if (faktanyaMatch) {
			facts = explanation.substring(faktanyaMatch.index!).trim();
			explanation = explanation.substring(0, faktanyaMatch.index!).trim();
		}

		let urlRegex = /(https?:\/\/[^\s]+)/g;
		let links: string[] = [];
		let match;
		while ((match = urlRegex.exec(linksText)) !== null) {
			links.push(match[0]);
		}

		return { explanation, facts, category: 'HOAKS', links };
	});
</script>

<svelte:window onkeydown={handleKeydown} />

{#if document}
	<!-- Backdrop -->
	<div
		class="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm sm:p-6"
		onclick={onClose}
		role="dialog"
		aria-modal="true"
		onkeydown={(e) => e.key === 'Enter' && onClose()}
		tabindex="-1"
	>
		<!-- Modal Content -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<div
			class="relative z-50 flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl"
			onclick={(e) => e.stopPropagation()}
			role="presentation"
		>
			<!-- Header -->
			<div class="flex items-start justify-between border-b border-slate-200 bg-white p-6">
				<h2 class="pr-8 text-2xl leading-tight font-bold text-slate-900">
					{document.title}
				</h2>
				<button
					type="button"
					onclick={onClose}
					class="absolute top-6 right-6 rounded-full bg-slate-100 p-2 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700"
				>
					<X class="h-5 w-5" />
				</button>
			</div>

			<!-- Scrollable Body -->
			<div class="custom-scrollbar flex-1 overflow-y-auto bg-slate-50 p-6">
				<!-- Metadata Tags -->
				<div
					class="mb-6 flex flex-wrap items-center gap-4 rounded-lg border border-slate-200 bg-white p-4 text-sm font-medium text-slate-600 shadow-sm"
				>
					{#if document.published_at}
						<div class="flex items-center gap-1.5">
							<Calendar class="h-4 w-4 text-slate-400" />
							<span>{formatDate(document.published_at)}</span>
						</div>
					{/if}

					{#if document.category}
						<div class="flex items-center gap-1.5">
							<FileText class="h-4 w-4 text-slate-400" />
							<span>{document.category}</span>
						</div>
					{/if}

					{#if document.topics}
						<div
							class="flex items-center gap-1.5 rounded border border-red-100 bg-red-50 px-2 py-1 text-red-700"
						>
							<Tag class="h-4 w-4" />
							<span>{document.topics}</span>
						</div>
					{/if}
				</div>

				<!-- Content -->
				<div
					class="prose prose-slate max-w-none rounded-lg border border-slate-200 bg-white p-6 leading-relaxed text-slate-800 shadow-sm"
				>
					{#if document.main_image_url}
						<img
							src={document.main_image_url}
							alt="Cover"
							class="mb-6 h-auto max-h-80 w-full rounded border border-slate-100 object-cover"
						/>
					{/if}

					<div class="text-base">
						{#if parsedContent.explanation || parsedContent.facts}
							<p class="mb-4">Penjelasan :</p>
							{#if parsedContent.explanation}
								<p class="mb-4 text-justify">{parsedContent.explanation}</p>
							{/if}
							{#if parsedContent.facts}
								<p class="mb-6 text-justify">{parsedContent.facts}</p>
							{/if}
						{:else}
							<p class="mb-6 text-justify whitespace-pre-wrap">{document.body_text}</p>
						{/if}

						<p class="mb-4 uppercase">
							KATEGORI: {document.category === 'Klarifikasi Hoaks'
								? 'HOAKS'
								: document.category?.toUpperCase() || 'HOAKS'}
						</p>

						{#if parsedContent.links.length > 0}
							<p class="mb-4">Link counter:</p>
							<ul class="list-disc space-y-2 pl-5">
								{#each parsedContent.links as link}
									<li>
										<a
											href={link}
											target="_blank"
											rel="noopener noreferrer"
											class="break-all text-blue-600 hover:text-blue-800 hover:underline"
										>
											{link}
										</a>
									</li>
								{/each}
							</ul>
						{/if}
					</div>
				</div>
			</div>

			<!-- Footer -->
			{#if document.url}
				<div class="flex justify-end border-t border-slate-200 bg-slate-50 p-6">
					<a
						href={document.url}
						target="_blank"
						rel="noopener noreferrer"
						class="flex items-center gap-2 rounded-md bg-slate-900 px-5 py-2.5 font-medium text-white shadow-sm transition-all hover:bg-slate-800"
					>
						<Link class="h-4 w-4" />
						<span>Buka Sumber Asli</span>
					</a>
				</div>
			{/if}
		</div>
	</div>
{/if}
