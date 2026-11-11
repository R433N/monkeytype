// Each pair is [what to find, what to replace it with]
const REPLACEMENTS = [
    [/\r\n?|[\u2028\u2029]/g, '\n'],                      // Windows / unusual line breaks
    [/\t/g, '    '],                                      // tabs -> 4 spaces
    [/[\u00A0\u2000-\u200A\u202F\u205F\u3000]/g, ' '],    // look-alike spaces -> normal space
    [/[\u200B-\u200D\uFEFF]/g, ''],                       // invisible zero-width characters
    [/[\u201C\u201D\u201E\u2033]/g, '"'],                 // “ ” „ ″ -> "
    [/[\u2018\u2019\u201A\u2032]/g, "'"],                 // ‘ ’ ‚ ′ -> '
    [/[\u2013\u2014]/g, '-'],                             // – — -> -
    [/\u2026/g, '...'],                                   // … -> ...
    [/ +$/gm, ''],                                        // spaces at the end of each line
    [/\n{3,}/g, '\n\n'],                                  // at most one blank line in a row
];

// Turns any pasted or seeded code into text that can be typed on a normal keyboard
export function cleanCode(code) {
    let cleaned = code;
    for (const [pattern, replacement] of REPLACEMENTS) {
        cleaned = cleaned.replace(pattern, replacement);
    }

    // Remove blank lines at the very start and end
    cleaned = cleaned.replace(/^\n+/, '').replace(/\n+$/, '');

    return removeCommonIndent(cleaned);
}

// If every line starts with the same spaces (e.g. a method copied out of a class), remove them
function removeCommonIndent(code) {
    const lines = code.split('\n');
    const indents = lines
        .filter(line => line.trim() !== '')
        .map(line => line.match(/^ */)[0].length);
    const smallest = Math.min(...indents);

    return lines.map(line => line.slice(smallest)).join('\n');
}