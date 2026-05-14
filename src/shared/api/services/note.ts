import { idbClient } from "#shared/storage/idb/idb-client.ts";
import { Result } from "@praha/byethrow";
import { IdbOperationError } from "#shared/storage/idb/errors.ts";
import { safeParse } from "#shared/lib/schema/parse.ts";
import { AppError } from "#shared/lib/errors/app-error.ts";
import * as v from "@valibot/valibot";
import {
  EditorFormats,
  SerializedEditorStateSchema,
} from "#shared/editor/schema.ts";

export type NoteServiceErrorCode = GetNoteErrorCode;

export class NoteServiceError<
  TCode extends NoteServiceErrorCode = NoteServiceErrorCode,
> extends AppError<TCode> {
  public override readonly name = "NoteServiceError";
}

const NoteDtoSchema = v.object({
  id: v.string(),
  title: v.string(),
  format: v.enum(EditorFormats),
  content: SerializedEditorStateSchema,
  isCorrupt: v.boolean(),
  createdAt: v.pipe(
    v.number(),
    v.transform((input) => Temporal.Instant.fromEpochMilliseconds(input)),
  ),
  updatedAt: v.pipe(
    v.number(),
    v.transform((input) => Temporal.Instant.fromEpochMilliseconds(input)),
  ),
});
export type NoteDtoOutput = v.InferOutput<typeof NoteDtoSchema>;

type GetNoteErrorCode =
  | "NOTE_GET_FAILED"
  | "NOTE_NOT_FOUND"
  | "NOTE_VALIDATION_FAILED";

export function getNote(
  id: string,
): Result.ResultAsync<NoteDtoOutput, NoteServiceError<GetNoteErrorCode>> {
  return Result.pipe(
    Result.try({
      try: async () => {
        const db = idbClient();

        const tx = db.transaction(["note_meta", "note_content"], "readonly");

        const metaPromise = tx.objectStore("note_meta").get(id)
          .catch((e) => {
            throw new IdbOperationError({
              action: "read",
              store: "note_meta",
              cause: e,
            });
          });

        const contentPromise = tx.objectStore("note_content").get(id)
          .catch((e) => {
            throw new IdbOperationError({
              action: "read",
              store: "note_content",
              cause: e,
            });
          });

        const [meta, content] = await Promise.all([
          metaPromise,
          contentPromise,
        ]);

        return { meta, content };
      },
      catch: (e) => {
        const idbError = e instanceof IdbOperationError
          ? e
          : new IdbOperationError(
            'Unknown error occurred while querying "note_meta" and "note_content" object store',
            { code: "IDB_UNKNOWN_FAILURE", cause: e },
          );

        return new NoteServiceError(
          "Failed to retrieve the note from IndexedDB",
          { code: "NOTE_GET_FAILED", cause: idbError },
        );
      },
    }),
    Result.andThen(({ meta, content }) => {
      if (meta === undefined && content === undefined) {
        return Result.fail(
          new NoteServiceError(`Note with id "${id}" not found`, {
            code: "NOTE_NOT_FOUND",
          }),
        );
      }

      return Result.succeed({ ...meta, content: content?.content });
    }),
    Result.andThen((noteDto) => safeParse(NoteDtoSchema, noteDto)),
    Result.mapError((e) => {
      if (e.name === "ValidationError") {
        return new NoteServiceError(
          "Failed to retrieve the note from IndexedDB",
          { code: "NOTE_VALIDATION_FAILED", cause: e },
        );
      }

      return e;
    }),
  );
}
