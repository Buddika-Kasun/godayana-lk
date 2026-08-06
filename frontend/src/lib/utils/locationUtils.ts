export const formatLocation = (location?: string) => {
  if (!location) return "N/A";

  // Split by comma and trim each part
  const parts = location.split(",").map((part) => part.trim());

  // Get last 2 parts
  const lastTwo = parts.slice(-2);

  // Capitalize each word in each part
  const capitalizedParts = lastTwo.map((part) => {
    return part
      .split(" ")
      .map((word) => {
        // Handle special cases like "Sri Lanka" -> "Sri Lanka" (keep both capitalized)
        // or "UAE" -> "UAE" (keep acronyms as is)
        if (word === word.toUpperCase() && word.length <= 4) {
          return word; // Keep acronyms like UAE, UK, USA as is
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(" ");
  });

  return capitalizedParts.join(", ");
};
