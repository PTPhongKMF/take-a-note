import { createEffect, createSignal, on, onCleanup } from "solid-js";
import type { Accessor } from "solid-js";
import { debounce } from "@std/async";
import type { EditorState } from "lexical";
import { jsonStringify } from "#shared/lib/json/json-stringify.ts";
import { Result } from "@praha/byethrow";

interface NoteDirtyStateParams {
  title: Accessor<string | undefined>;
  format: Accessor<string | undefined>;
  isNoteMetaDirty: Accessor<boolean>;
  editorState: Accessor<EditorState | undefined>;
  latestSerializedState: Accessor<string | undefined>;
}

/** Return `true` if the note has unsaved changes, `false` otherwise. */
export function createNoteDirtyState(params: NoteDirtyStateParams) {
  const [isDirty, setIsDirty] = createSignal(false);

  function evaluateDirtyState(
    isNoteMetaDirty: boolean,
    current?: EditorState,
    latestSerialized?: string,
  ) {
    setIsDirty(
      isNoteMetaDirty ||
        Result.unwrap(jsonStringify(current)) !== latestSerialized,
    );
  }

  const checkIsDirtyDebounced = debounce(
    (
      isNoteMetaDirty: boolean,
      current?: EditorState,
      latestSerialized?: string,
    ) => evaluateDirtyState(isNoteMetaDirty, current, latestSerialized),
    500,
  );

  // On user input, debounced
  createEffect(
    on(
      () => [
        params.title(),
        params.format(),
        params.editorState(),
        params.latestSerializedState(),
        params.isNoteMetaDirty(),
      ],
      () =>
        checkIsDirtyDebounced(
          params.isNoteMetaDirty(),
          params.editorState(),
          params.latestSerializedState(),
        ),
      { defer: true },
    ),
  );

  // System/Baseline Updates (Immediate resolution)
  createEffect(
    on(params.latestSerializedState, () => {
      // The save finished! Kill any pending debounce timers...
      checkIsDirtyDebounced.clear();
      evaluateDirtyState(
        params.isNoteMetaDirty(),
        params.editorState(),
        params.latestSerializedState(),
      );
    }),
  );

  onCleanup(() => checkIsDirtyDebounced.clear());

  return isDirty;
}
