export interface AppErrorOptions<TCode extends string> extends ErrorOptions {
  code: TCode;
}

export class AppError<TCode extends string = string> extends Error {
  public override readonly name: string = "AppError";
  public readonly code: TCode;

  constructor(
    message = "Something went wrong. Please try again later",
    options: AppErrorOptions<TCode>,
  ) {
    super(message, options);

    this.code = options.code;
  }
}
