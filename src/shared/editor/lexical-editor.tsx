import { LexicalComposer } from "@ryotarofr/lexical-solid/LexicalComposer";
import { RichTextPlugin } from "@ryotarofr/lexical-solid/LexicalRichTextPlugin";
import { HistoryPlugin } from "@ryotarofr/lexical-solid/LexicalHistoryPlugin";
import { OnChangePlugin } from "@ryotarofr/lexical-solid/LexicalOnChangePlugin";
import { LexicalErrorBoundary } from "@ryotarofr/lexical-solid/LexicalErrorBoundary";
import { ContentEditable } from "@ryotarofr/lexical-solid/LexicalContentEditable";
import type { EditorState, SerializedEditorState } from "lexical";
import {
  type ComponentProps,
  createContext,
  createSignal,
  Match,
  onMount,
  type ParentProps,
  Show,
  splitProps,
  Switch,
  useContext,
} from "solid-js";
import { c } from "#shared/lib/class-merger/c.ts";
import type { EditorFormat } from "#shared/editor/schema.ts";
import { getEditorInitialConfig } from "#shared/editor/initial-config.ts";
import { DraggableBlockPlugin } from "#shared/editor/plugins/draggable-block.tsx";
import ActiveBlockIndicatorPlugin from "#shared/editor/plugins/active-block-indicator.tsx";

const EditorFormatContext = createContext<EditorFormat>("plain-text");

interface EditorProps
  extends Omit<ComponentProps<"div">, "onInput">, ParentProps {
  format: EditorFormat;
  value?: SerializedEditorState;
  onInput?: (value: SerializedEditorState) => void;
}

/**
 * The root `<LexicalComposer />` for the Lexical editor.
 */
export function Editor(props: EditorProps) {
  const [local, others] = splitProps(props, [
    "format",
    "value",
    "onInput",
    "class",
    "children",
  ]);

  const initialConfig = getEditorInitialConfig(local.format, local.value);

  function handleEditorChange(editorState: EditorState) {
    if (local.onInput) {
      const serializedState = editorState.toJSON();
      local.onInput(serializedState);
    }
  }

  return (
    <Show when={local.format} keyed>
      {(fmt) => (
        <LexicalComposer initialConfig={initialConfig}>
          <div {...others} class={c("relative size-full", local.class)}>
            <EditorFormatContext.Provider value={fmt}>
              {local.children}
            </EditorFormatContext.Provider>
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

  let divWrapperRef: HTMLDivElement | undefined;
  const [wrapperRef, setWrapperRef] = createSignal<HTMLElement>();

  onMount(() => {
    if (divWrapperRef) setWrapperRef(divWrapperRef);
  });

  const format = useContext(EditorFormatContext);

  function placeholderFn() {
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
    <div
      ref={divWrapperRef}
      class="relative size-full"
    >
      <Switch>
        <Match when={format === "plain-text"}>
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                {...others}
                aria-placeholder={local.placeholder ?? ""}
                placeholder={placeholderFn}
                class={c("size-full", local.class)}
              />
            }
            errorBoundary={LexicalErrorBoundary}
          />
        </Match>
      </Switch>

      <ActiveBlockIndicatorPlugin />
      <Show when={wrapperRef()}>
        {(ref) => <DraggableBlockPlugin anchorRef={ref()} />}
      </Show>
    </div>
  );
}
