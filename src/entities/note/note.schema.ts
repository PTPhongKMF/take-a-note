import * as v from "@valibot/valibot";

const NoteFormats = {
  plaintext: "plaintext",
  markdown: "markdown",
  richtext: "richtext",
};

export const NoteSchema = v.object({
  id: v.string(),
  format: v.enum(NoteFormats),
  title: v.string(),
  content: v.string(),
  createdAt: v.date(),
  updatedAt: v.date(),
});
