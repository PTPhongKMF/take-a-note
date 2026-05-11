import { Match } from "solid-js";
import { splitProps } from "solid-js";
import type { ComponentProps } from "solid-js";
import { Switch } from "solid-js";
import { createSignal } from "solid-js";
import type { EditorState } from "lexical";
import { createEffect } from "solid-js";
import { debounce } from "@std/async";
import { onCleanup } from "solid-js";
import { jsonStringify } from "#shared/lib/json/json-stringify.ts";
import { c } from "#shared/lib/class-merger/c.ts";
import { on } from "solid-js";

interface SaveIndicatorProps extends ComponentProps<"div"> {
  title?: string;
  format?: string;
  isNoteMetaDirty: boolean;
  editorState?: EditorState;
  latestSerializedState?: string;
  setLatestSerializedState: (state: string) => void;
}

// TODO: finish save to db on isDirty === true, must also debounced, about 5000ms
export default function SaveIndicator(props: SaveIndicatorProps) {
  const [local, others] = splitProps(props, ["class"]);
  const [isDirty, setIsDirty] = createSignal(false);

  const checkIsDirtyDebounced = debounce(
    (
      isNoteMetaDirty: boolean,
      current?: EditorState,
      latestSerialized?: string,
    ) =>
      setIsDirty(
        isNoteMetaDirty || jsonStringify(current) !== latestSerialized,
      ),
    500,
  );

  createEffect(
    on(
      () => [props.title, props.format, props.editorState],
      () =>
        checkIsDirtyDebounced(
          props.isNoteMetaDirty,
          props.editorState,
          props.latestSerializedState,
        ),
    ),
  );

  onCleanup(() => checkIsDirtyDebounced.clear());

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      {...others}
      class={c("w-full text-end", local.class)}
    >
      <Switch>
        <Match when={isDirty()}>
          <p class="truncate italic">Unsaved changes</p>
        </Match>
        <Match when={!isDirty()}>
          <p class="truncate">
            All changes saved
          </p>
        </Match>
      </Switch>
    </div>
  );
}
