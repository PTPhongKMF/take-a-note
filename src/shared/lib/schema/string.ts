import * as v from "@valibot/valibot";

export const vTrimNonEmptyString = v.pipe(v.string(), v.trim(), v.nonEmpty());
