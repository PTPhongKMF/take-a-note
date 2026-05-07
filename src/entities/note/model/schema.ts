import * as v from "@valibot/valibot";
import {
  EditorFormats,
  LexicalEditorAstSchema,
} from "#shared/editor/schema.ts";

export const NoteSchema = v.object({
  id: v.string(),
  format: v.enum(EditorFormats),
  title: v.string(),
  content: LexicalEditorAstSchema,
  createdAt: v.string(),
  updatedAt: v.string(),
});

export type NoteOutput = v.InferOutput<typeof NoteSchema>;
