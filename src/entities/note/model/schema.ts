import * as v from "@valibot/valibot";
import {
  EditorFormats,
  SerializedEditorStateSchema,
} from "#shared/editor/schema.ts";

export const NoteSchema = v.object({
  id: v.string(),
  title: v.string(),
  format: v.enum(EditorFormats),
  content: SerializedEditorStateSchema,
  isCorrupt: v.boolean(),
  createdAt: v.string(),
  updatedAt: v.string(),
});

export type NoteOutput = v.InferOutput<typeof NoteSchema>;
