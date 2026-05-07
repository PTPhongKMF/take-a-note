import * as v from "@valibot/valibot";
import type { SerializedEditorState } from "lexical";

export const EditorFormats = {
  plaintext: "plain-text",
  markdown: "markdown",
  richtext: "rich-text",
} as const;

export type EditorFormat = typeof EditorFormats[keyof typeof EditorFormats];

// export const LexicalEditorAstSchema = v.object({
//   root: v.object({
//     type: v.literal("root"),
//     children: v.custom<SerializedLexicalNode[]>(
//       (val) => Array.isArray(val),
//     ),
//     direction: v.nullable(v.union([v.literal("ltr"), v.literal("rtl")])),
//     format: v.custom<ElementFormatType>(
//       (val) => typeof val === "string",
//     ),
//     indent: v.number(),
//     version: v.number(),
//   }),
// });

export const LexicalEditorAstSchema = v.custom<SerializedEditorState>((input) =>
  typeof input === "object" && input !== null && "root" in input
);
