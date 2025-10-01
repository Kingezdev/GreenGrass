/**
 * Formats a number into readable string (k/M/B) with optional thresholds and decimal control.
 *
 * @param {number} value - The number to format.
 * @param {object} options - Optional configuration.
 * @param {number} options.thousand - Threshold for thousands. Default 1000.
 * @param {number} options.million - Threshold for millions. Default 1_000_000.
 * @param {number} options.billion - Threshold for billions. Default 1_000_000_000.
 * @param {number} options.decimals - Number of decimals for formatted values. Default 1.
 * @returns {string} Formatted number.
 */
export function formatPrice(
  value,
  options = { thousand: 1000, million: 1_000_000, billion: 1_000_000_000, decimals: 1 }
) {
  const { thousand, million, billion, decimals } = options;

  if (value >= billion) return `${(value / billion).toFixed(decimals)}B`;
  if (value >= million) return `${(value / million).toFixed(decimals)}M`;
  if (value >= thousand) return `${(value / thousand).toFixed(decimals)}k`;
  return value.toString();
}
