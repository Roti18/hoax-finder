# HoaxFinder - Sistem Temu Kembali Informasi

Proyek ini adalah tugas **Ujian Akhir Semester (UAS)** untuk mata kuliah **Temu Kembali Informasi**. Aplikasi ini merupakan sebuah mesin pencari (*Search Engine*) sederhana untuk menemukan artikel klarifikasi hoaks.

## Deskripsi Proyek
HoaxFinder dibangun untuk melakukan pencarian terhadap kumpulan data klarifikasi hoaks yang bersumber dari Kementerian Komunikasi dan Digital (Komdigi) RI. Tujuan utama proyek ini adalah untuk mengimplementasikan algoritma penelusuran informasi secara langsung di sisi *client* (browser).

## Metode & Teknologi yang Digunakan
- **Metode Pencarian**: Aplikasi ini mengimplementasikan algoritma pemeringkatan **Okapi BM25**. Algoritma ini berjalan sepenuhnya di sisi *client-side* untuk mencocokkan kueri pengguna dengan dokumen indeks berdasarkan frekuensi kata (TF) dan *Inverse Document Frequency* (IDF).
- **Preprocessing Teks**: Sebelum diindeks, teks dokumen dan kueri melewati tahapan *case folding*, penghapusan tanda baca, *tokenizing*, filter *stopword* (bahasa Indonesia), dan *stemming* (menggunakan algoritma sastrawi/aturan *stemming* dasar bahasa Indonesia).
- **Dataset**: Data yang digunakan bersumber dari dataset Kaggle [Indonesian Hoax News Dataset](https://www.kaggle.com/datasets/ireddragonicy/indonesian-hoax-news-dataset) yang disimpan dalam format JSON (`komdigi_hoaks.json`). Dataset ini berisi kumpulan artikel klarifikasi hoaks dari Kementerian Komunikasi dan Digital RI.
- **Tech Stack**: 
  - [SvelteKit](https://kit.svelte.dev/) (Svelte 5) - *Frontend Framework*
  - [Tailwind CSS](https://tailwindcss.com/) - *Styling*
  - [Lucide Icons](https://lucide.dev/) - Ikon antarmuka

## Cara Menjalankan Proyek (Development)

Pastikan Anda telah menginstal [Node.js](https://nodejs.org/) atau [Bun](https://bun.sh/).

1. **Install Dependencies**:
   ```sh
   npm install
   # atau
   bun install
   ```

2. **Jalankan Server Development**:
   ```sh
   npm run dev
   # atau
   bun run dev
   ```

3. Buka browser dan arahkan ke `http://localhost:5173`.

## Building untuk Produksi

Untuk membuat versi produksi (*production version*):

```sh
npm run build
# atau
bun run build
```

Anda dapat mencoba melihat hasil build dengan perintah `npm run preview`.
