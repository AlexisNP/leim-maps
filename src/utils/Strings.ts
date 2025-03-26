/**
 * Normalize a string to be used as a key
 * @param str
 */
export function normalizeString(str: string) {
    if (!str) return ''
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()
}
