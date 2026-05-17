import { mutationOptions } from "@tanstack/solid-query";
import { Result } from "@praha/byethrow";
import { buildMutationKey } from "#shared/lib/tanstack-query/build-key.ts";
import { type NoteDtoOutput, saveNote } from "#shared/api/services/note.ts";
import { delay } from "@std/async/delay";

type Success = Result.InferSuccess<typeof saveNote>;
type Failure = Result.InferFailure<typeof saveNote>;

export const saveNoteMutation = {
  key: buildMutationKey({
    entity: "note",
    action: "save",
  }),
  get options() {
    return mutationOptions<Success, Failure, NoteDtoOutput>({
      mutationKey: saveNoteMutation.key,
      mutationFn: async (note: NoteDtoOutput) => {
        const result = await saveNote(note);

        return Result.unwrap(result);
      },
      onSuccess: (_d, _v, _omr, _context) => {
        // TODO: Invalidate only the relevant queries
        // context.client.invalidateQueries();
      },
    });
  },
};
