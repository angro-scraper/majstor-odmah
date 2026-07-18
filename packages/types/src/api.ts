export type ApiSuccess<T> = { success: true; data: T; error: null };
export type ApiFailure = { success: false; data: null; error: { code: string; message: string; requestId?: string } };
export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;
