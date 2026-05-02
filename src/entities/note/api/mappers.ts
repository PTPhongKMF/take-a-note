import type {
  NoteContentIdbOutput,
  NoteMetaIdbOutput,
} from "#shared/storage/idb/schemas.ts";
import type { NoteOutput } from "#entities/note/model/schema.ts";

export function mapFromIdbToNote(
  note: NoteMetaIdbOutput,
  noteContent: NoteContentIdbOutput,
): NoteOutput {
  return { ...note, content: noteContent.content };
}
