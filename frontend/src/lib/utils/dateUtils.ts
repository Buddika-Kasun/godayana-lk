// src/lib/utils/dateUtils.ts

/**
 * Format a date string to a relative time string (e.g., "2 hours ago", "Yesterday", "3 days ago")
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();

  // Calculate differences
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  // Today
  if (diffDays === 0) {
    if (diffHours === 0) {
      if (diffMinutes === 0) return "Just now";
      if (diffMinutes === 1) return "1 minute ago";
      return `${diffMinutes} minutes ago`;
    }
    if (diffHours === 1) return "1 hour ago";
    return `${diffHours} hours ago`;
  }

  // Yesterday
  if (diffDays === 1) return "Yesterday";

  // This week
  if (diffDays <= 7) {
    if (diffDays === 1) return "1 day ago";
    return `${diffDays} days ago`;
  }

  // This month
  if (diffDays <= 30) {
    const weeks = Math.floor(diffDays / 7);
    if (weeks === 1) return "1 week ago";
    return `${weeks} weeks ago`;
  }

  // This year
  if (diffDays <= 365) {
    const months = Math.floor(diffDays / 30);
    if (months === 1) return "1 month ago";
    return `${months} months ago`;
  }

  // More than a year
  const years = Math.floor(diffDays / 365);
  if (years === 1) return "1 year ago";
  return `${years} years ago`;
};

/**
 * Format a date to a readable string (e.g., "Jan 15, 2024")
 */
export const formatReadableDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "Invalid date";
  }
};

/**
 * Format a date to a full date string (e.g., "January 15, 2024")
 */
export const formatFullDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "Invalid date";
  }
};

/**
 * Format a date with time (e.g., "Jan 15, 2024, 2:30 PM")
 */
export const formatDateTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "Invalid date";
  }
};

/**
 * Check if a date is today
 */
export const isToday = (dateString: string): boolean => {
  const date = new Date(dateString);
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

/**
 * Check if a date is yesterday
 */
export const isYesterday = (dateString: string): boolean => {
  const date = new Date(dateString);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  );
};

export const formatPostedDate = (dateString?: string) => {
  if (!dateString) return "Recently";
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString();
  } catch {
    return "Recently";
  }
};
