import type { EditorMode } from "#shared/editor/schema.ts";
import type { SerializedEditorState } from "lexical";
import type { InitialConfigType } from "@ryotarofr/lexical-solid/LexicalComposer";

export function getEditorInitialConfig(
  mode: EditorMode,
  initialValue?: SerializedEditorState,
): InitialConfigType {
  const baseConfig = {
    editorState: initialValue
      ? (editor) => {
        const initialState = editor.parseEditorState(initialValue);
        editor.setEditorState(initialState);
      }
      : undefined,

    onError: (_e) => {/** TODO: trigger toast */},
  } satisfies Partial<InitialConfigType>;

  switch (mode) {
    case "plain-text":
      return { ...baseConfig, namespace: "PlainTextEditor" };
    case "markdown":
      return { ...baseConfig, namespace: "MarkdownEditor" };
    case "rich-text":
      return { ...baseConfig, namespace: "RichTextEditor" };
    default: {
      const exhaustiveCheck: never = mode;
      return exhaustiveCheck;
    }
  }
}
