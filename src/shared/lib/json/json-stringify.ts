/**
 * Types that JSON.stringify converts to a naked `undefined` value.
 */
type Unstringifiable = undefined | ((...args: unknown[]) => unknown) | symbol;

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
): T extends Unstringifiable ? undefined
  : (Extract<T, Unstringifiable> extends never ? string : string | undefined) {
  // deno-lint-ignore no-explicit-any
  return JSON.stringify(value, replacer as any, space) as any;
}
