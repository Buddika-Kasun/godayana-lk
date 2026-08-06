export interface ApiErrorResponse {
  success: false;
  message: string;
  data?: string;
  errorCode?: string;
  timestamp: number;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data?: T;
  message?: string;
  timestamp: number;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;