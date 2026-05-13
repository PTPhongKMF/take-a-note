import { idbClient } from "#shared/storage/idb/idb-client.ts";
import { Result } from "@praha/byethrow";
import {
  IdbOperationError,
  IdbUnknownError,
} from "#shared/storage/idb/errors.ts";
import { safeParse } from "#shared/lib/schema/parse.ts";
import {
  AppError,
  type AppErrorOptions,
} from "#shared/lib/errors/app-error.ts";
import * as v from "@valibot/valibot";
import {
  EditorFormats,
  SerializedEditorStateSchema,
} from "#shared/editor/schema.ts";

export type NoteServiceErrorCode =
  | "NOTE_GET_FAILED"
  // | "NOTE_META_NOT_FOUND"
  | "NOTE_NOT_FOUND";
// |
// | 'NOTE_ALREADY_EXISTS'
// | 'NOTE_VALIDATION_FAILED'
// | 'NOTE_LIMIT_REACHED';

export class NoteServiceError<
  TCode extends NoteServiceErrorCode = NoteServiceErrorCode,
> extends AppError<TCode> {
  public override readonly name = "NoteServiceError";
  public override readonly code: TCode;

  constructor(
    code: TCode,
    message: string,
    options?: Omit<AppErrorOptions<TCode>, "code">,
  );
  constructor(
    code: TCode,
    options?: Omit<AppErrorOptions<TCode>, "code">,
  );

  constructor(
    code: TCode,
    messageOrOptions?:
      | string
      | Omit<AppErrorOptions<TCode>, "code">,
    options?: Omit<AppErrorOptions<TCode>, "code">,
  ) {
    const resolvedMsg = typeof messageOrOptions === "string"
      ? messageOrOptions
      : `Note operation failed: ${code}`;
    const resolvedOpts = typeof messageOrOptions === "string"
      ? options
      : messageOrOptions;

    super(resolvedMsg, { ...resolvedOpts, code });

    this.code = code;
  }
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

export type GetNoteErrorCode = Extract<
  NoteServiceErrorCode,
  "NOTE_GET_FAILED" | "NOTE_NOT_FOUND"
>;

export function getNote(
  id: string,
): Result.ResultAsync<NoteDtoOutput, NoteServiceError<GetNoteErrorCode>> {
  return Result.pipe(
    Result.succeed(id),
    Result.andThen((unwrappedId) =>
      Result.try({
        try: async () => {
          const db = idbClient();

          const tx = db.transaction(["note_meta", "note_content"], "readonly");

          const metaPromise = tx.objectStore("note_meta").get(unwrappedId)
            .catch((e) => {
              throw new IdbOperationError("read", "note_meta", { cause: e });
            });

          const contentPromise = tx.objectStore("note_content").get(unwrappedId)
            .catch((e) => {
              throw new IdbOperationError("read", "note_content", { cause: e });
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
            : new IdbUnknownError(
              'Unknown error occurred while querying "note_meta" and "note_content" object store',
              {
                cause: e,
              },
            );

          return new NoteServiceError(
            "NOTE_GET_FAILED",
            "Failed to retrieve the note from IndexedDB",
            { cause: idbError },
          );
        },
      })
    ),
    Result.andThen(({ meta, content }) => {
      if (meta === undefined && content === undefined) {
        return Result.fail(new NoteServiceError("NOTE_NOT_FOUND"));
      }

      return Result.succeed({ ...meta, content: content?.content });
    }),
    Result.andThen((noteDto) => safeParse(NoteDtoSchema, noteDto)),
    Result.mapError((e) => {
      if (e.name === "ValidationError") {
        return new NoteServiceError(
          "NOTE_GET_FAILED",
          "Failed to retrieve the note from IndexedDB.",
          { cause: e },
        );
      }

      return e;
    }),
  );
}
