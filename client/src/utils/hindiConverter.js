
/**
 * Detection logic for Krutidev 010 (Remington Layout)
 * Used to conditionally apply the Krutidev font in the UI.
 * 
 * NOTE: We do NOT convert the data. We save it "as-is" (ASCII) and use CSS to render it.
 */

export function isKrutidev(str) {
    if (!str || typeof str !== 'string' || str.length < 3) return false;
    
    // 1. If it has actual Hindi Unicode, it's not raw Krutidev ASCII
    if (/[\u0900-\u097F]/.test(str)) return false;

    // 2. Common English word bypass (Force English if these words exist)
    const englishWords = ['and', 'the', 'of', 'science', 'food', 'history', 'trends', 'reflections', 'crime', 'punishment', 'raj', 'administration', 'during', 'viceroyalty', 'book'];
    const lower = str.toLowerCase();
    if (englishWords.some(word => lower.includes(word))) return false;

    // 3. Strong Krutidev signatures (Almost never in English)
    const strongSignatures = [
        'xzkeh', 'fodkl', 'fl)', 'uhfr', 'izkcU', 'izkS', '्र', '¼', '½', 'xzke', 'lekt', ',oa', 'iqL'
    ];
    if (strongSignatures.some(sig => lower.includes(sig))) return true;

    // 4. Vowel Density Check (English is vowel-rich, Krutidev ASCII is not)
    const vowelCount = (str.match(/[aeiou]/gi) || []).length;
    const vowelDensity = vowelCount / str.length;
    const wordCount = str.trim().split(/\s+/).length;

    // 5. Symbol Detection (Krutidev uses these for specific Hindi letters)
    const krutiSpecificSymbols = /[ñòôéæçª;\[\]\\{}|_]/.test(str);
    
    // --- DECISION LOGIC ---

    // A. High vowel density + multiple words = English
    if (wordCount >= 2 && vowelDensity > 0.28) return false;

    // B. Krutidev "f" prefix (f + consonant)
    const hasKrutiF = /\bf[^aeiou\s]/.test(lower);
    if (hasKrutiF) return true;

    // C. Krutidev symbols
    if (krutiSpecificSymbols) return true;

    // D. Low vowel density catch-all (Junk ASCII)
    if (str.length > 8 && vowelDensity < 0.22) return true;

    return false;
}
