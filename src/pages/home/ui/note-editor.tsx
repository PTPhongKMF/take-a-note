import { createForm, Field, Form, getInput, useField } from "@formisch/solid";
import { type ComponentProps, createSignal, splitProps } from "solid-js";
import { c } from "#shared/lib/class-merger/c.ts";
import type { NoteOutput } from "#entities/note/model/schema.ts";
import { monotonicUlid } from "@std/ulid";
import { Editor, EditorInput } from "#shared/editor/lexical-editor.tsx";
import * as v from "@valibot/valibot";
import type { EditorState } from "lexical";
import { Separator } from "@kobalte/core/separator";
import NoteFormatSwitcher from "#features/switch-note-format/ui/note-format-switcher.tsx";
import { EditorFormats } from "#shared/editor/schema.ts";
import { trimNonEmptyString } from "#shared/lib/valibot/trim-non-empty-string.ts";
import SaveIndicator from "#features/save-note/ui/save-indicator.tsx";
import { jsonStringify } from "#shared/lib/json/json-stringify.ts";

interface NoteEditorProps extends
  Omit<
    ComponentProps<"form">,
    "onSubmit" | "children" | "action" | "method" | "onReset"
  > {
  note?: NoteOutput;
}

const NoteFormSchema = v.object({
  id: trimNonEmptyString,
  title: v.string(),
  format: v.enum(EditorFormats),
  createdAt: v.string(),
  updatedAt: v.string(),
});

type NoteFormOutput = v.InferOutput<typeof NoteFormSchema>;

export default function NoteEditor(props: NoteEditorProps) {
  const [local, others] = splitProps(props, ["class", "note"]);

  const [latestSerializedNoteContent, setLatestSerializedNoteContent] =
    createSignal(
      jsonStringify(local.note?.content),
    );
  // TODO: test if we make it undefined, then parse the serialized obj to lexcial, will it also trigger onChanges initially
  // to update our signal?
  const [noteContent, setNoteContent] = createSignal<EditorState>();

  const noteForm = createForm({
    schema: NoteFormSchema,
    initialInput: {
      id: local.note?.id ?? monotonicUlid(),
      format: local.note?.format ?? "plain-text",
      title: local.note?.title ?? "",
      createdAt: local.note?.createdAt ?? Temporal.Now.instant().toString(),
      updatedAt: local.note?.updatedAt ?? Temporal.Now.instant().toString(),
    },
  });

  function handleSaveNote(output: NoteFormOutput) {
    console.log("Saving note:", { ...output, content: noteContent() });
  }

  return (
    <Form
      of={noteForm}
      onSubmit={handleSaveNote}
      {...others}
      class={c(
        "grid grid-rows-[auto_auto_1fr] gap-[clamp(0.25rem,2cqi,1.5rem)] rounded-md bg-paper-editor py-2",
        local.class,
      )}
    >
      <div class="flex flex-col items-center justify-start gap-[clamp(0.25rem,0.5cqi,1rem)] px-8">
        <Field of={noteForm} path={["title"]}>
          {(field) => (
            <input
              {...field.props}
              value={field.input}
              placeholder="Note title..."
              class={`w-full self-start rounded-none border-b-3 px-1 outline-none border-transparent bg-transparent py-1 text-base font-bold 
                transition-colors duration-200
                focus:border-amber-600`}
            />
          )}
        </Field>

        <div class="flex w-full items-center justify-between px-4">
          <Field of={noteForm} path={["format"]}>
            {(field) => (
              <NoteFormatSwitcher
                {...field.props}
                value={field.input}
                onInput={field.onInput}
              />
            )}
          </Field>

          <SaveIndicator
            title={getInput(noteForm, { path: ["title"] })}
            format={getInput(noteForm, { path: ["format"] })}
            isNoteMetaDirty={useField(noteForm, { path: ["title"] }).isDirty ||
              useField(noteForm, { path: ["format"] }).isDirty}
            editorState={noteContent()}
            latestSerializedState={latestSerializedNoteContent()}
            setLatestSerializedState={setLatestSerializedNoteContent}
            class="text-fluid-sm"
          />
        </div>
      </div>

      <Separator class="mx-auto w-[93%] bg-amber-800 " />

      <div class="flex flex-col gap-1.5 text-fluid-sm">
        <Editor
          format={getInput(noteForm, { path: ["format"] }) ?? "plain-text"}
          initialValue={props.note?.content}
          onInput={setNoteContent}
          class="size-full min-h-fit"
        >
          <EditorInput
            placeholder="Note content..."
            class="rounded-sm border-amber-600 px-12 py-4 text-base outline-none"
          />
        </Editor>
      </div>
    </Form>
  );
}
