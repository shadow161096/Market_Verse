/**
 * Format a numeric price value into a display string.
 * Uses Intl.NumberFormat for locale-aware formatting.
 */
export function formatPrice(
    price: number,
    currency = "USD",
    locale = "en-US"
): string {
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
    }).format(price);
}

/**
 * Calculate percentage discount between original and sale price.
 */
export function calcDiscount(original: number, sale: number): number {
    return Math.round(((original - sale) / original) * 100);
}
