export interface AppErrorOptions<TCode extends string = string>
  extends ErrorOptions {
  code: TCode;
  metadata?: Record<string, string | number | boolean>;
}

export abstract class AppError<TCode extends string = string> extends Error {
  public abstract override readonly name: string;
  public readonly code: TCode;
  public readonly metadata?: Record<string, string | number | boolean>;

  constructor(
    message: string,
    options: AppErrorOptions<TCode>,
  ) {
    super(message, options);

    this.code = options.code;
    this.metadata = options.metadata;
  }
}
