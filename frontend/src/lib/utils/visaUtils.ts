export const formatDateDisplay = (dateString?: string) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
};

export const formatCountryName = (country: string) => {
    if (!country) return "Not specified";

    // Remove "other_" prefix if present
    const formatted = country.replace(/^other_/, "");

    // Capitalize each word
    return formatted
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };