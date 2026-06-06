import { BM25 } from './bm25';
import { preprocessText } from './preprocessing';
// Gunakan import langsung ke JSON
import komdigiDataRaw from '../data/komdigi_hoaks.json';

export interface DocumentData {
    id: number;
    title: string;
    excerpt: string;
    body_text: string;
    category: string;
    topics: string;
    published_at: string;
    url?: string;
    main_image_url?: string;
}

export interface SearchResult {
    document: DocumentData;
    score: number;
}

export interface PaginatedResult {
    results: SearchResult[];
    total: number;
    page: number;
    totalPages: number;
}

export class SearchEngine {
    private bm25: BM25;
    private documentStore: Map<number, DocumentData>;
    public isInitialized = false;

    constructor() {
        this.bm25 = new BM25();
        this.documentStore = new Map();
    }

    /**
     * Memuat dataset JSON dan mengindeks seluruh dokumen menggunakan algoritma BM25.
     */
    initialize() {
        if (this.isInitialized) return;

        const data = komdigiDataRaw as DocumentData[];
        for (const doc of data) {
            this.documentStore.set(doc.id, doc);

            // Menggabungkan Title dan Body Text untuk di-index
            const textToIndex = `${doc.title} ${doc.body_text}`;
            const tokens = preprocessText(textToIndex);

            this.bm25.addDocument(doc.id, tokens);
        }

        this.isInitialized = true;
    }

    /**
     * Melakukan pencarian berdasarkan query yang diberikan dengan fitur pagination.
     */
    search(query: string, page = 1, limit = 20): PaginatedResult {
        const emptyResult = { results: [], total: 0, page: 1, totalPages: 0 };

        if (!this.isInitialized) {
            this.initialize();
        }

        if (!query.trim()) return emptyResult;

        const queryTokens = preprocessText(query);
        if (queryTokens.length === 0) return emptyResult;

        const bm25Results = this.bm25.search(queryTokens);

        if (bm25Results.length === 0) return emptyResult;

        const total = bm25Results.length;
        const totalPages = Math.ceil(total / limit);
        
        // Pastikan page tidak melebihi batas
        const currentPage = Math.max(1, Math.min(page, totalPages));
        
        const startIndex = (currentPage - 1) * limit;
        const endIndex = startIndex + limit;

        // Ambil hasil sesuai limit dan page
        const results = bm25Results.slice(startIndex, endIndex).map(res => {
            return {
                document: this.documentStore.get(res.docId)!,
                score: res.score // Skor murni hasil rumus matematika BM25
            };
        });

        return {
            results,
            total,
            page: currentPage,
            totalPages
        };
    }
}

// Export singleton instance agar index hanya dibuat sekali per load aplikasi
export const engine = new SearchEngine();
