import type { SimplifyDeep } from "type-fest";

/**
 * A recursive type that removes `undefined` from types and converts
 * properties that could be undefined into optional properties.
 */
type CompactRecursive<T> = T extends Array<infer U> ? Array<CompactRecursive<U>>
  : T extends Record<string, unknown> ?
      & {
        // 1. Keep properties that can NEVER be undefined
        [K in keyof T as undefined extends T[K] ? never : K]: CompactRecursive<
          T[K]
        >;
      }
      & {
        // 2. Make properties optional if they CAN be undefined
        [K in keyof T as undefined extends T[K] ? K : never]?: CompactRecursive<
          Exclude<T[K], undefined>
        >;
      }
  : Exclude<T, undefined>;

type CompactKey<T> = SimplifyDeep<CompactRecursive<T>>;

// Constrain the input to only allow Objects or Arrays
type ValidKeyInput = Record<string, unknown> | unknown[];

/**
 * Deeply removes properties with `undefined` values to prevent TanStack Query's fuzzy matching
 * (`partialDeepEqual`) from failing when comparing explicit `undefined` properties against missing keys.
 *
 * Refs:
 * - https://github.com/TkDodo/blog-comments/discussions/71#discussioncomment-4348406
 * - https://github.com/TanStack/query/issues/3741
 */
export function __compactKey__<const T extends ValidKeyInput>(
  input: T,
): CompactKey<T> {
  // Handle Arrays
  if (Array.isArray(input)) {
    const arrResult = [];
    for (let i = 0; i < input.length; i++) {
      const val = input[i];
      if (val !== undefined) {
        if (val !== null && typeof val === "object") {
          arrResult.push(__compactKey__(val as ValidKeyInput));
        } else {
          arrResult.push(val);
        }
      }
    }
    return arrResult as CompactKey<T>;
  }

  // Handle Objects
  const objResult = {} as Record<string, unknown>;
  for (const key in input) {
    if (!Object.prototype.hasOwnProperty.call(input, key)) continue;

    const val = (input as Record<string, unknown>)[key];

    if (val !== undefined) {
      if (val !== null && typeof val === "object") {
        objResult[key] = __compactKey__(val as ValidKeyInput);
      } else {
        objResult[key] = val;
      }
    }
  }

  return objResult as CompactKey<T>;
}
