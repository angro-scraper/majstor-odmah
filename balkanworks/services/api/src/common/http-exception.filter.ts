import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";

type ExceptionResponse = string | { message?: string | string[]; error?: string; code?: string };
type RequestLike = { method: string; url: string };
type ResponseLike = { status(status: number): { json(body: unknown): void } };

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const request = context.getRequest<RequestLike>();
    const response = context.getResponse<ResponseLike>();
    const isHttpException = exception instanceof HttpException;
    const status = isHttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse = isHttpException ? exception.getResponse() as ExceptionResponse : undefined;
    const message = this.messageFor(exceptionResponse, status);
    const code = this.codeFor(exceptionResponse, status);

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      const stack = exception instanceof Error ? exception.stack : undefined;
      this.logger.error(`${request.method} ${request.url} failed with ${status}`, stack);
    } else {
      this.logger.warn(`${request.method} ${request.url} returned ${status}: ${message}`);
    }

    response.status(status).json({
      success: false,
      error: { code, message },
    });
  }

  private messageFor(response: ExceptionResponse | undefined, status: number): string | string[] {
    if (typeof response === "string") return response;
    if (response?.message) return response.message;
    return status === HttpStatus.INTERNAL_SERVER_ERROR ? "Internal server error" : "Request failed";
  }

  private codeFor(response: ExceptionResponse | undefined, status: number): string {
    if (typeof response !== "string" && response?.code) return response.code;
    if (typeof response !== "string" && response?.error) return response.error.toUpperCase().replaceAll(" ", "_");
    return HttpStatus[status] ?? "REQUEST_FAILED";
  }
}
