import * as v from "@valibot/valibot";
import { Result } from "@praha/byethrow";
import { AppError } from "#shared/lib/errors/app-error.ts";

type ValidationErrorCode = "VALIDATION_FAILED";

interface ValidationErrorOptions extends ErrorOptions {
  code?: ValidationErrorCode;
}

class ValidationError extends AppError<ValidationErrorCode> {
  public override readonly name = "ValidationError";

  constructor(
    message = "Validation failed",
    opts?: ValidationErrorOptions,
  ) {
    super(message, { ...opts, code: "VALIDATION_FAILED" });
  }
}

// sync schema
export function safeParse<
  TSchema extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
>(
  schema: TSchema,
  input: unknown,
): Result.Result<v.InferOutput<TSchema>, ValidationError>;

// async schema
export function safeParse<
  TSchema extends v.BaseSchemaAsync<unknown, unknown, v.BaseIssue<unknown>>,
>(
  schema: TSchema,
  input: unknown,
): Result.ResultAsync<v.InferOutput<TSchema>, ValidationError>;

export function safeParse(
  schema:
    | v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>
    | v.BaseSchemaAsync<unknown, unknown, v.BaseIssue<unknown>>,
  input: unknown,
):
  | Result.Result<unknown, ValidationError>
  | Result.ResultAsync<unknown, ValidationError> {
  if (!schema.async) {
    const result = v.safeParse(schema, input);

    if (!result.success) {
      return Result.fail(
        new ValidationError("TODO: create a prettyfy error fn", {
          cause: new v.ValiError(result.issues),
        }),
      );
    }

    return Result.succeed(result.output);
  } else {
    const resultPromise = v.safeParseAsync(schema, input).then((result) => {
      if (!result.success) {
        return Result.fail(
          new ValidationError("TODO: create a prettyfy error fn", {
            cause: new v.ValiError(result.issues),
          }),
        );
      }

      return Result.succeed(result.output);
    });

    return resultPromise;
  }
}
