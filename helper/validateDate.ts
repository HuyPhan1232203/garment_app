// dateUtils.ts

/**
 * Converts an ISO 8601 date string to yyyy-MM-dd HH:mm format
 * @param isoDateString - The ISO 8601 date string (e.g., "2025-02-13T14:00:00")
 * @param useUTC - Optional: If true, uses UTC time; otherwise, uses local time (default: false)
 * @returns Formatted date string (e.g., "2025-02-13 14:00")
 * @throws Error if the date string is invalid
 */
export function formatDateToString(
  isoDateString: string,
  useUTC: boolean = false
): string {
  const date = new Date(isoDateString);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date string: ${isoDateString}`);
  }

  // Use UTC or local time based on the useUTC parameter
  const year = useUTC ? date.getUTCFullYear() : date.getFullYear();
  const month = String(
    (useUTC ? date.getUTCMonth() : date.getMonth()) + 1
  ).padStart(2, "0");
  const day = String(useUTC ? date.getUTCDate() : date.getDate()).padStart(
    2,
    "0"
  );
  const hours = String(useUTC ? date.getUTCHours() : date.getHours()).padStart(
    2,
    "0"
  );
  const minutes = String(
    useUTC ? date.getUTCMinutes() : date.getMinutes()
  ).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

// Example usage (for testing)
// try {
//   console.log(formatDateToString("2025-02-13T14:00:00")); // Output: "2025-02-13 14:00" (local time)
//   console.log(formatDateToString("2025-02-13T14:00:00Z", true)); // Output: "2025-02-13 14:00" (UTC)
// } catch (error) {
//   console.error(error);
// }
