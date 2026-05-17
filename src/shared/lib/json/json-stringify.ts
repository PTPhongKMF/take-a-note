import { Result } from "@praha/byethrow";
import {
  AppError,
  type AppErrorOptions,
} from "#shared/lib/errors/app-error.ts";

class JsonStringifyError extends AppError<"JSON_STRINGIFY_FAILED"> {
  public override readonly name = "JsonStringifyError";

  constructor(
    message = "Failed to convert value to a JSON string",
    opts?: Omit<AppErrorOptions<"JSON_STRINGIFY_FAILED">, "code">,
  ) {
    super(message, { ...opts, code: "JSON_STRINGIFY_FAILED" });
  }
}

/**
 * Types that JSON.stringify converts to a naked `undefined` value.
 */
type Unstringifiable = undefined | ((...args: unknown[]) => unknown) | symbol;

/**
 * Extracted helper type to avoid repeating the complex conditional logic
 */
type StringifyResult<T> = T extends Unstringifiable ? undefined
  : (Extract<T, Unstringifiable> extends never ? string : string | undefined);

/**
 * A type-safe wrapper for JSON.stringify.
 * If the input can be undefined/symbol, the return type includes undefined.
 * Otherwise, it's guaranteed to be a string.
 */
export function jsonStringify<T>(
  value: T,
  replacer?:
    | ((this: unknown, key: string, value: unknown) => unknown)
    | (string | number)[]
    | null,
  space?: string | number,
): Result.Result<StringifyResult<T>, JsonStringifyError> {
  return Result.try({
    try: () =>
      // deno-lint-ignore no-explicit-any
      JSON.stringify(value, replacer as any, space) as StringifyResult<T>,
    catch: () => new JsonStringifyError(),
  });
}
