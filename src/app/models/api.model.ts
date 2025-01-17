export interface ApiResponse<T> {
  isSuccess: boolean;
  statusCode: number;
  responseMessage: string | null;
  content: T;
}
