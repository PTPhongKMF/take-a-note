export interface AppErrorOptions<TCode extends string = string> extends ErrorOptions {
  code?: TCode;
  metadata?: Record<string, string | number | boolean>;
}

export class AppError<TCode extends string = string> extends Error {
  public override readonly name: string = "AppError";
  public readonly code?: TCode;
  public readonly metadata?: Record<string, string | number | boolean>;

  constructor(
    message = "An unexpected error occurred",
    options?: AppErrorOptions<TCode>,
  ) {
    super(message, options);

    this.code = options?.code;
    this.metadata = options?.metadata;
  }
}
