import { LexicalComposer } from "@ryotarofr/lexical-solid/LexicalComposer";
import { PlainTextPlugin } from "@ryotarofr/lexical-solid/LexicalPlainTextPlugin";
import { HistoryPlugin } from "@ryotarofr/lexical-solid/LexicalHistoryPlugin";
import { OnChangePlugin } from "@ryotarofr/lexical-solid/LexicalOnChangePlugin";
import { LexicalErrorBoundary } from "@ryotarofr/lexical-solid/LexicalErrorBoundary";
import { ContentEditable } from "@ryotarofr/lexical-solid/LexicalContentEditable";
import type { EditorState, SerializedEditorState } from "lexical";
import {
  type ComponentProps,
  createContext,
  Match,
  type ParentProps,
  Show,
  splitProps,
  Switch,
  useContext,
} from "solid-js";
import { c } from "#shared/lib/class-merger/c.ts";
import type { EditorMode } from "#shared/editor/schema.ts";
import { getEditorInitialConfig } from "#shared/editor/initial-config.ts";

const EditorModeContext = createContext<EditorMode>("plain-text");

interface EditorProps
  extends Omit<ComponentProps<"div">, "onInput">, ParentProps {
  mode: EditorMode;
  value?: SerializedEditorState;
  onInput?: (value: SerializedEditorState) => void;
}

/**
 * The root `<LexicalComposer />` for the Lexical editor.
 */
export function Editor(props: EditorProps) {
  const [local, others] = splitProps(props, [
    "mode",
    "value",
    "onInput",
    "class",
    "children",
  ]);

  const initialConfig = getEditorInitialConfig(local.mode, local.value);

  function handleEditorChange(editorState: EditorState) {
    if (local.onInput) {
      const serializedState = editorState.toJSON();
      local.onInput(serializedState);
    }
  }

  return (
    <Show when={local.mode} keyed>
      {(mode) => (
        <LexicalComposer initialConfig={initialConfig}>
          <div {...others} class={c("relative size-full", local.class)}>
            <EditorModeContext.Provider value={mode}>
              {local.children}
            </EditorModeContext.Provider>
          </div>

          <HistoryPlugin />
          <OnChangePlugin onChange={handleEditorChange} />
        </LexicalComposer>
      )}
    </Show>
  );
}

interface EditorInputProps extends ComponentProps<"div"> {
  placeholder?: string;
}

/**
 * The typing canvas for the editor.
 */
export function EditorInput(props: EditorInputProps) {
  const [local, others] = splitProps(props, ["class", "placeholder"]);

  const mode = useContext(EditorModeContext);

  function sharedPlaceholder() {
    return (
      <div
        textContent={local.placeholder ?? ""}
        class={c(
          local.class,
          "pointer-events-none absolute inset-0 size-full select-none",
          "border-none bg-transparent shadow-none ring-0 outline-none",
          "text-black opacity-50",
        )}
      />
    );
  }

  return (
    <div class="relative size-full">
      <Switch>
        <Match when={mode === "plain-text"}>
          <PlainTextPlugin
            contentEditable={
              <ContentEditable
                {...others}
                aria-placeholder={local.placeholder ?? ""}
                placeholder={sharedPlaceholder}
                class={c("size-full", local.class)}
              />
            }
            errorBoundary={LexicalErrorBoundary}
          />
        </Match>
      </Switch>
    </div>
  );
}
