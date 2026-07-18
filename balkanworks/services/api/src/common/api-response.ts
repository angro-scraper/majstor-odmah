export const ok = <T>(data: T) => ({ success: true as const, data, error: null });
export const fail = (code: string, message: string) => ({ success: false as const, data: null, error: { code, message } });
