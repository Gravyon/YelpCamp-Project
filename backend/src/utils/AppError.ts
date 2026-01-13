interface AppErrorArgs {
  message?: string;
  httpCode: number;
  details?: any;
  isOperational?: boolean;
}

export class AppError extends Error {
  public readonly httpCode: number;
  public readonly isOperational: boolean;
  public readonly details?: any;

  constructor({
    message,
    httpCode,
    details,
    isOperational = true,
  }: AppErrorArgs) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype); // Without this, 'err instanceof AppError' might return false due to TypeScript
    this.httpCode = httpCode;
    if (details) this.details = details;
    this.isOperational = isOperational; // Default to true. If we manually throw this error, we know what it is.
    // Passing 'this.constructor' hides the AppError constructor itself from the stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}
