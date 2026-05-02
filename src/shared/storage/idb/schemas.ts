import * as v from "@valibot/valibot";
import type { DBSchema } from "idb";
import { EditorModes, LexicalEditorAstSchema } from "#shared/editor/schema.ts";

export const NoteMetaIdbSchema = v.object({
  id: v.string(),
  mode: v.enum(EditorModes),
  title: v.string(),
  isCorrupt: v.boolean(),
  createdAt: v.string(),
  updatedAt: v.string(),
});

export type NoteMetaIdbOutput = v.InferOutput<typeof NoteMetaIdbSchema>;

export const NoteContentIdbSchema = v.object({
  noteId: v.string(),
  content: LexicalEditorAstSchema,
});

export type NoteContentIdbOutput = v.InferOutput<typeof NoteContentIdbSchema>;

export interface TakeANoteDbSchema extends DBSchema {
  note: {
    key: NoteMetaIdbOutput["id"];
    value: NoteMetaIdbOutput;
    indexes: {
      updatedAt: NoteMetaIdbOutput["updatedAt"];
    };
  };

  noteContent: {
    key: NoteContentIdbOutput["noteId"];
    value: NoteContentIdbOutput;
  };
}
