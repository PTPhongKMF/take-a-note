import {
  createForm,
  Field,
  Form,
  getAllErrors,
  getInput,
  reset,
  submit,
  useField,
} from "@formisch/solid";
import { type ComponentProps, createSignal, splitProps } from "solid-js";
import { c } from "#shared/lib/class-merger/c.ts";
import { monotonicUlid } from "@std/ulid";
import { Editor, EditorInput } from "#shared/editor/lexical-editor.tsx";
import * as v from "@valibot/valibot";
import type { EditorState } from "lexical";
import { Separator } from "@kobalte/core/separator";
import NoteFormatSwitcher from "#features/switch-note-format/ui/note-format-switcher.tsx";
import { EditorFormats } from "#shared/editor/schema.ts";
import { vTrimNonEmptyString } from "#shared/lib/schema/string.ts";
import SaveStatusIndicator from "#features/save-note/ui/save-status-indicator.tsx";
import { jsonStringify } from "#shared/lib/json/json-stringify.ts";
import { vTemporalInstant } from "#shared/lib/schema/datetime.ts";
import { Result } from "@praha/byethrow";
import { createNoteDirtyState } from "#entities/note/model/note-dirty-state.ts";
import type { NoteDtoOutput } from "#shared/api/services/note.ts";
import { createEffect } from "solid-js";
import { on } from "solid-js";
import createSaveNoteManager from "#features/save-note/model/save-note-manager.ts";
import { batch } from "solid-js";

interface NoteEditorProps extends
  Omit<
    ComponentProps<"form">,
    "onSubmit" | "children" | "action" | "method" | "onReset"
  > {
  note?: NoteDtoOutput;
}

const NoteFormSchema = v.pipe(
  v.object({
    id: vTrimNonEmptyString,
    title: v.string(),
    format: v.enum(EditorFormats),
    isCorrupt: v.boolean(),
    createdAt: vTemporalInstant,
    updatedAt: vTemporalInstant,
  }),
  v.transform((input) => ({
    ...input,
    ...(!input.title.trim() &&
      { title: "Untitled Note " + input.createdAt.toLocaleString() }),
    updatedAt: Temporal.Now.instant(),
  })),
);
type NoteFormOutput = v.InferOutput<typeof NoteFormSchema>;

export default function NoteEditor(props: NoteEditorProps) {
  const [local, others] = splitProps(props, ["class", "note"]);

  const [lastChangedAt, setLastChangedAt] = createSignal(
    Temporal.Now.instant(),
  );

  const [latestSerializedNoteContent, setLatestSerializedNoteContent] =
    createSignal(Result.unwrap(jsonStringify(local.note?.content)));
  const [noteContent, setNoteContent] = createSignal<EditorState>();

  const noteForm = createForm({
    schema: NoteFormSchema,
    initialInput: {
      id: local.note?.id ?? monotonicUlid(),
      title: local.note?.title ?? "",
      format: local.note?.format ?? "plain-text",
      isCorrupt: local.note?.isCorrupt ?? false,
      createdAt: local.note?.createdAt ?? Temporal.Now.instant(),
      updatedAt: local.note?.updatedAt ?? Temporal.Now.instant(),
    },
  });

  const titleField = useField(noteForm, { path: ["title"] });
  const formatField = useField(noteForm, { path: ["format"] });

  const isDirty = createNoteDirtyState({
    title: () => getInput(noteForm, { path: ["title"] }),
    format: () => getInput(noteForm, { path: ["format"] }),
    isNoteMetaDirty: () => titleField.isDirty || formatField.isDirty,
    editorState: noteContent,
    latestSerializedState: latestSerializedNoteContent,
  });

  const saveManager = createSaveNoteManager({
    isDirty,
    lastChangedAt: lastChangedAt,
    triggerFormSubmit: () => submit(noteForm),
    onSaveSuccess: (savedNote: NoteDtoOutput) => {
      console.log("Note saved success ran");
      batch(() => {
        reset(noteForm, {
          initialInput: { ...savedNote },
          keepInput: true,
          keepErrors: true,
          keepTouched: true,
          keepSubmitted: true,
        });

        setLatestSerializedNoteContent(
          Result.unwrap(jsonStringify(savedNote.content)),
        );
      });
    },
  });

  createEffect(on(
    () => [
      getInput(noteForm, { path: ["title"] }),
      getInput(noteForm, { path: ["format"] }),
      noteContent(),
    ],
    () => setLastChangedAt(Temporal.Now.instant()),
  ));

  function handleSaveNote(output: NoteFormOutput) {
    const note = { ...output, content: noteContent()?.toJSON() };
    saveManager.cancelAutosave();
    saveManager.executeSave(note);
  }

  createEffect(() => {
    console.log("dirty: " + isDirty());
  });

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

          <SaveStatusIndicator
            isDirty={isDirty()}
            isSaving={saveManager.isSaving()}
          />
        </div>
      </div>

      <Separator class="mx-auto w-[93%] bg-amber-800" />

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
