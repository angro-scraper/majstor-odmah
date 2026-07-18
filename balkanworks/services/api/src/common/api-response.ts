export const ok = <T>(data: T, message = "Operation completed") => ({ success: true as const, data, message, error: null });
export const fail = (code: string, message: string) => ({ success: false as const, data: null, message: null, error: { code, message } });
