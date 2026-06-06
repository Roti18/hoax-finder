export class BM25 {
	// Parameter standar BM25
	private k1: number;
	private b: number;

	// Penyimpanan internal untuk skor
	private termFrequencies: Map<string, Map<number, number>>; // term -> docId -> count
	private documentLengths: Map<number, number>; // docId -> panjang token
	private documentFrequencies: Map<string, number>; // term -> jumlah dokumen yg mengandung term tsb
	private totalDocuments: number;
	private averageDocumentLength: number;

	constructor(k1 = 1.5, b = 0.75) {
		this.k1 = k1;
		this.b = b;
		this.termFrequencies = new Map();
		this.documentLengths = new Map();
		this.documentFrequencies = new Map();
		this.totalDocuments = 0;
		this.averageDocumentLength = 0;
	}

	/**
	 * Menambahkan dokumen ke dalam index BM25
	 */
	addDocument(docId: number, tokens: string[]) {
		const docLength = tokens.length;
		this.documentLengths.set(docId, docLength);
		this.totalDocuments++;

		const termCounts = new Map<string, number>();
		for (const token of tokens) {
			termCounts.set(token, (termCounts.get(token) || 0) + 1);
		}

		for (const [term, count] of termCounts.entries()) {
			if (!this.termFrequencies.has(term)) {
				this.termFrequencies.set(term, new Map());
			}
			this.termFrequencies.get(term)!.set(docId, count);
			this.documentFrequencies.set(term, (this.documentFrequencies.get(term) || 0) + 1);
		}

		// Update panjang rata-rata setelah dokumen ditambahkan
		let totalLength = 0;
		for (const length of this.documentLengths.values()) {
			totalLength += length;
		}
		this.averageDocumentLength = totalLength / this.totalDocuments;
	}

	/**
	 * Rumus Inverse Document Frequency (IDF) BM25
	 */
	private calculateIDF(term: string): number {
		const df = this.documentFrequencies.get(term) || 0;
		// Rumus IDF standard BM25
		return Math.log((this.totalDocuments - df + 0.5) / (df + 0.5) + 1);
	}

	/**
	 * Mencari dokumen berdasarkan query tokens
	 */
	search(queryTokens: string[]): { docId: number; score: number }[] {
		const scores = new Map<number, number>();

		for (const token of queryTokens) {
			if (!this.termFrequencies.has(token)) continue;

			const idf = this.calculateIDF(token);
			const docsWithTerm = this.termFrequencies.get(token)!;

			for (const [docId, tf] of docsWithTerm.entries()) {
				const docLength = this.documentLengths.get(docId)!;

				// Menghitung TF (Term Frequency) yang dinormalisasi dengan k1 dan b
				const numerator = tf * (this.k1 + 1);
				const denominator =
					tf + this.k1 * (1 - this.b + this.b * (docLength / this.averageDocumentLength));

				const termScore = idf * (numerator / denominator);

				// Tambahkan skor ke dokumen yang bersangkutan
				scores.set(docId, (scores.get(docId) || 0) + termScore);
			}
		}

		// Ubah Map menjadi Array dan urutkan dari skor tertinggi ke terendah
		const results = Array.from(scores.entries())
			.map(([docId, score]) => ({ docId, score }))
			.sort((a, b) => b.score - a.score);

		return results;
	}
}
