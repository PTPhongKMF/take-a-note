import { useLexicalComposerContext } from "@ryotarofr/lexical-solid/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  BLUR_COMMAND,
  COMMAND_PRIORITY_LOW,
  FOCUS_COMMAND,
} from "lexical";
import { mergeRegister } from "@lexical/utils";
import { createEffect, createSignal, onCleanup, Show } from "solid-js";

export default function ActiveBlockIndicatorPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isFocused, setIsFocused] = createSignal(true);
  const [activeElementTop, setActiveElementTop] = createSignal<number>();
  const [activeElementHeight, setActiveElementHeight] = createSignal<number>();

  function updateHighlightPosition() {
    editor.getEditorState().read(() => {
      const selection = $getSelection();

      // Hide border if no text is selected/focused
      if (!$isRangeSelection(selection) || !isFocused()) {
        setActiveElementTop(undefined);
        return;
      }

      const anchorNode = selection.anchor.getNode();
      const topLevelElement = anchorNode.getTopLevelElement();
      if (!topLevelElement) return;

      const domElement = editor.getElementByKey(topLevelElement.getKey());

      if (domElement) {
        // Track the top position and height of the current line's block
        setActiveElementTop(domElement.offsetTop);
        setActiveElementHeight(domElement.offsetHeight);
      }
    });
  }

  createEffect(() => {
    const removeUpdateListener = mergeRegister(
      editor.registerUpdateListener(() => {
        updateHighlightPosition();
      }),
      editor.registerCommand(
        BLUR_COMMAND,
        () => {
          setIsFocused(false);
          updateHighlightPosition(); // Re-run logic to hide the border
          return false; // Return false to let other blur listeners run too
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        FOCUS_COMMAND,
        () => {
          setIsFocused(true);
          updateHighlightPosition(); // Re-run logic to show the border
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );

    onCleanup(() => {
      removeUpdateListener();
    });
  });

  return (
    <Show when={activeElementTop()}>
      <div
        aria-hidden="true"
        class="pointer-events-none absolute w-[3px] rounded-full bg-amber-600"
        style={{
          top: `${activeElementTop()}px`,
          height: `${activeElementHeight()}px`,
        }}
      />
    </Show>
  );
}
