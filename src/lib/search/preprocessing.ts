export function preprocessText(text: string): string[] {
    if (!text) return [];
    
    // 1. Lowercase
    let processed = text.toLowerCase();
    
    // 2. Remove punctuation and numbers
    processed = processed.replace(/[^\w\s]/gi, ' ');
    
    // 3. Tokenization
    let tokens = processed.split(/\s+/).filter(t => t.length > 0);
    
    // 4. Stopword removal (Bahasa Indonesia)
    const stopwords = new Set([
        "yang", "di", "ke", "dari", "pada", "dalam", "untuk", "dengan", "dan", "atau", 
        "ini", "itu", "juga", "sudah", "akan", "oleh", "sebagai", "bahwa", "karena", 
        "seperti", "bisa", "tidak", "ada", "adalah", "saat", "setelah", "namun", 
        "mereka", "kita", "kami", "saya", "kamu", "dia", "tersebut", "tentang", "serta",
        "menjadi", "lebih", "sangat", "lalu", "bagi", "lagi", "banyak", "harus", "hanya"
    ]);
    
    tokens = tokens.filter(t => !stopwords.has(t));
    
    return tokens;
}
