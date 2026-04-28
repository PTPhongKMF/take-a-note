interface AppErrorOptions<TCode extends string> extends ErrorOptions {
  code?: TCode;
}

export class AppError<TCode extends string = string> extends Error {
  public override readonly name: string = "AppError";
  public readonly code?: AppErrorOptions<TCode>["code"];

  constructor(
    message = "Something went wrong. Please try again later",
    opts?: AppErrorOptions<TCode>,
  ) {
    super(message, opts);

    this.code = opts?.code;
  }
}
