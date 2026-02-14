
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

    // 2. Krutidev signatures (Very specific clusters that don't appear in English)
    const impossibleEnglish = [
        'xzkeh', 'fodkl', 'fl)', 'uhfr', 'izkcU', 'izkS', '्र', '¼', '½'
    ];
    
    const lowercase = str.toLowerCase();
    const hasImpossible = impossibleEnglish.some(sig => lowercase.includes(sig));
    
    // 3. Check for specific Krutidev symbols that aren't used in English book titles
    const hasKrutiSymbols = /[ñòôéæçª]/.test(str);

    // 4. Refined English Initial Check
    // If it's a name with initials like "A. K. Singh", it's English.
    const isEnglishWithInitials = /^[A-Z]\.\s[A-Z]\.\s[A-Z][a-z]+/.test(str) || 
                                 /^[A-Z][a-z]+\s[A-Z]\.\s[A-Z]\.\s/.test(str) ||
                                 /^[A-Z]\.\s[A-Z][a-z]+/.test(str);

    // 5. Basic English Title Check
    const isEnglishTitle = /^[A-Za-z0-9\s,.\-()&:'"/]+$/.test(str) && 
                          (str.includes(' ') || str.length > 10) &&
                          !hasKrutiSymbols;
    
    // 6. Signature patterns that are 100% Krutidev
    const hasKrutiMatra = /\bf[vlkdghj]/.test(lowercase) || /iz[kdi]/.test(lowercase);

    // If it's English with initials or a standard title, return false
    if (isEnglishWithInitials || (isEnglishTitle && !hasImpossible && !hasKrutiMatra)) return false;

    // Final check: It must have a signature OR look like "junk" ASCII
    return hasImpossible || hasKrutiSymbols || hasKrutiMatra || (str.length > 5 && !/[aeiou]/i.test(str));
}
