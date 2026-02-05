export interface ApiResponse<T> {
  status: 'success' | 'error';
  statusCode: number;
  message: string | null;
  data: T | Record<string, T>;
}
