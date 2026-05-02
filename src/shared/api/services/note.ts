import { idbClient } from "#shared/storage/idb/idb-client.ts";
import { Result } from "@praha/byethrow";
import { IdbOperationError } from "#shared/storage/idb/errors.ts";
import { parseSafe } from "#shared/lib/valibot/parse.ts";
import {
  NoteContentIdbSchema,
  NoteMetaIdbSchema,
} from "#shared/storage/idb/schemas.ts";
import {
  AppError,
  type AppErrorOptions,
} from "#shared/lib/errors/app-error.ts";

export type NoteServiceErrorCode = "NOTE_NOT_FOUND";
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

export function getNoteMeta(id: string) {
  return Result.pipe(
    Result.succeed(id),
    Result.andThen((unwrappedId) =>
      Result.try({
        try: () => idbClient().get("note", unwrappedId),
        catch: (e) => new IdbOperationError("read", "note", { cause: e }),
      })
    ),
    Result.andThen((note) =>
      note === undefined
        ? Result.fail(new NoteServiceError("NOTE_NOT_FOUND"))
        : Result.succeed(note)
    ),
    Result.andThen((note) => parseSafe(NoteMetaIdbSchema, note)),
  );
}

export function getNoteContent(id: string) {
  return Result.pipe(
    Result.succeed(id),
    Result.andThen((unwrappedId) =>
      Result.try({
        try: () => idbClient().get("note", unwrappedId),
        catch: (e) => new IdbOperationError("read", "note", { cause: e }),
      })
    ),
    Result.andThen((note) =>
      note === undefined
        ? Result.fail(new NoteServiceError("NOTE_NOT_FOUND"))
        : Result.succeed(note)
    ),
    Result.andThen((noteContent) =>
      parseSafe(NoteContentIdbSchema, noteContent)
    ),
  );
}
