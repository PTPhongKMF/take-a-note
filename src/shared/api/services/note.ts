import { idbClient } from "#shared/storage/idb/idb-client.ts";
import { Result } from "@praha/byethrow";
import {
  IdbOperationError,
  IdbUnknownError,
} from "#shared/storage/idb/errors.ts";
import { safeParse } from "#shared/lib/valibot/parse.ts";
import {
  AppError,
  type AppErrorOptions,
} from "#shared/lib/errors/app-error.ts";
import * as v from "@valibot/valibot";
import { EditorModes, LexicalEditorAstSchema } from "#shared/editor/schema.ts";

export type NoteServiceErrorCode =
  | "NOTE_META_NOT_FOUND"
  | "NOTE_NOT_FOUND";
// |
// | 'NOTE_ALREADY_EXISTS'
// | 'NOTE_VALIDATION_FAILED'
// | 'NOTE_LIMIT_REACHED';

export class NoteServiceError extends AppError<NoteServiceErrorCode> {
  public override readonly name = "NoteServiceError";

  constructor(
    code: NoteServiceErrorCode,
    message: string,
    options?: AppErrorOptions<NoteServiceErrorCode>,
  );
  constructor(
    code: NoteServiceErrorCode,
    options?: AppErrorOptions<NoteServiceErrorCode>,
  );

  constructor(
    code: NoteServiceErrorCode,
    messageOrOptions?: string | AppErrorOptions<NoteServiceErrorCode>,
    options?: AppErrorOptions<NoteServiceErrorCode>,
  ) {
    const resolvedMsg = typeof messageOrOptions === "string"
      ? messageOrOptions
      : `Note operation failed: ${code}`;
    const resolvedOpts = typeof messageOrOptions === "string"
      ? options
      : messageOrOptions;

    super(resolvedMsg, {
      ...resolvedOpts,
      code,
    });
  }
}

const NoteDtoSchema = v.object({
  id: v.string(),
  mode: v.enum(EditorModes),
  title: v.string(),
  content: LexicalEditorAstSchema,
  isCorrupt: v.boolean(),
  createdAt: v.string(),
  updatedAt: v.string(),
});

export function getNote(id: string) {
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
          if (e instanceof IdbOperationError) {
            return e;
          }

          return new IdbUnknownError(
            'Unknown error occurred while querying "note_meta" and "note_content" object store',
            { cause: e },
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
  );
}
