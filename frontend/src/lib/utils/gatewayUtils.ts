// Status display mapping
export const STATUS_DISPLAY: Record<string, { label: string; color: string }> = {
  PENDING: {
    label: "Pending",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  REVIEW: {
    label: "In Review",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  },
  CANCELLED: {
    label: "Cancelled",
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  },
  COMPLETED: {
    label: "Completed",
    color:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  },
};

export const getStatusConfig = (status: string) => {
  return STATUS_DISPLAY[status] || STATUS_DISPLAY.PENDING;
};

// Helper functions
export const getStudyLevelLabel = (value: string) => {
  const labels: Record<string, string> = {
    UNDERGRADUATE: "Undergraduate",
    POSTGRADUATE: "Postgraduate",
    MASTERS: "Master's Degree",
    DOCTORATE: "Doctorate",
    PHD: "PhD",
    DIPLOMA: "Diploma",
    CERTIFICATE: "Certificate",
  };
  return labels[value] || value;
};

export const getIntakeLabel = (value: string) => {
  const labels: Record<string, string> = {
    SEPTEMBER_2024: "September 2024",
    JANUARY_2025: "January 2025",
    MAY_2025: "May 2025",
    SEPTEMBER_2025: "September 2025",
    JANUARY_2026: "January 2026",
  };
  return labels[value] || value;
};

export const getLanguageTestStatusLabel = (value: string) => {
  const labels: Record<string, string> = {
    COMPLETED: "Completed",
    PLANNING: "Planning to do soon",
    IN_PROGRESS: "In Progress",
    NOT_STARTED: "Not Started",
  };
  return labels[value] || value;
};

export const getApplyWithinLabel = (value: string) => {
  const labels: Record<string, string> = {
    "1month": "1 Month",
    "3months": "3 Months",
    "6months": "6 Months",
    "other": "Other",
  };
  return labels[value] || value;
};

export const formatCurrency = (amount?: number) => {
  // if (!amount) return "N/A";
  return `LKR ${amount?.toFixed(2)}`;
};