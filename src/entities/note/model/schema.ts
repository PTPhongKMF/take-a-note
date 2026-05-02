import * as v from "@valibot/valibot";
import { EditorModes, LexicalEditorAstSchema } from "#shared/editor/schema.ts";

export const NoteSchema = v.object({
  id: v.string(),
  mode: v.enum(EditorModes),
  title: v.string(),
  content: LexicalEditorAstSchema,
  createdAt: v.string(),
  updatedAt: v.string(),
});

export type NoteOutput = v.InferOutput<typeof NoteSchema>;
