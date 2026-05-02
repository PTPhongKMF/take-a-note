interface CriticalErrorOptions extends ErrorOptions {
  metadata?: Record<string, string | number | boolean>;
}

export class CriticalError extends Error {
  public override readonly name: string = "CriticalError";
  public readonly metadata?: CriticalErrorOptions["metadata"];

  constructor(
    message = "A critical system error occurred",
    options?: CriticalErrorOptions,
  ) {
    super(message, options);

    this.metadata = options?.metadata;
  }
}
