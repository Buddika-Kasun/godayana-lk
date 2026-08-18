import { AxiosError } from "axios";

// Helper to extract error message from Axios error
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const responseData = error.response?.data as {
      success?: boolean;
      message?: string;
      data?: Record<string, string>;
      errorCode?: string;
    };

    // Check if it's a validation error with data object
    if (responseData?.data && typeof responseData.data === "object") {
      const firstErrorKey = Object.keys(responseData.data)[0];
      if (firstErrorKey) {
        return responseData.data[firstErrorKey];
      }
    }

    // Return the main message if available
    if (responseData?.message) {
      return responseData.message;
    }

    // Return default error messages based on status
    if (error.response?.status === 400) {
      return "Invalid request. Please check your information.";
    }
    if (error.response?.status === 401) {
      return "You need to login first.";
    }
    if (error.response?.status === 403) {
      return "You don't have permission to apply for this job.";
    }
    if (error.response?.status === 404) {
      return "Job not found.";
    }
    if (error.response?.status === 409) {
      return "You have already applied for this job.";
    }
    if (error.response?.status === 429) {
      return "Too many requests. Please try again later.";
    }
    if (error.code === "ECONNABORTED") {
      return "Request timeout. Please try again.";
    }
    if (error.code === "ERR_NETWORK") {
      return "Network error. Please check your connection.";
    }

    return error.message || "An error occurred";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred";
};
