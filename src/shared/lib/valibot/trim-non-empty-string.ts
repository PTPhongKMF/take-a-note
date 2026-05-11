import * as v from "@valibot/valibot";

export const trimNonEmptyString = v.pipe(v.string(), v.trim(), v.nonEmpty());
