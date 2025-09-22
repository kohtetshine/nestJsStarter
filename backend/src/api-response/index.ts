export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  data?: T;
  error?: string;
}

export function ok<T>(data: T, statusCode = 200): ApiResponse<T> {
  return { success: true, statusCode, data };
}

export function fail(message: string, statusCode = 400): ApiResponse<never> {
  return { success: false, statusCode, error: message };
}
