import { createForm, Field, Form, getInput } from "@formisch/solid";
import { type ComponentProps, createSignal, splitProps } from "solid-js";
import { c } from "#shared/lib/class-merger/c.ts";
import { type NoteOutput, NoteSchema } from "#entities/note/model/schema.ts";
import { monotonicUlid } from "@std/ulid";
import { Editor, EditorInput } from "#shared/editor/lexical-editor.tsx";
import * as v from "@valibot/valibot";
import type { SerializedEditorState } from "lexical";

interface NoteEditorProps extends
  Omit<
    ComponentProps<"form">,
    "onSubmit" | "children" | "action" | "method" | "onReset"
  > {
  note?: NoteOutput;
}

const NoteFormSchema = v.omit(NoteSchema, ["content"]);
type NoteFormOutput = v.InferOutput<typeof NoteFormSchema>;

export default function NoteEditor(props: NoteEditorProps) {
  const [local, others] = splitProps(props, ["class", "note"]);

  const [noteContent, setNoteContent] = createSignal<
    SerializedEditorState | undefined
  >(local.note?.content ?? undefined);

  const noteForm = createForm({
    schema: NoteFormSchema,
    initialInput: {
      id: local.note?.id ?? monotonicUlid(),
      mode: local.note?.mode ?? "plain-text",
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
        "grid grid-rows-[auto_1fr] gap-[clamp(0.5rem,2cqi,1rem)]",
        local.class,
      )}
    >
      <Field of={noteForm} path={["title"]}>
        {(field) => (
          <input
            {...field.props}
            value={field.input}
            placeholder="Note title..."
            class="w-full rounded-sm border border-amber-600 bg-paper-editor px-3 py-2 text-base font-semibold focus:outline-3 focus:outline-amber-300"
          />
        )}
      </Field>

      <Editor
        mode={getInput(noteForm, { path: ["mode"] }) ?? "plain-text"}
        value={noteContent()}
        onInput={setNoteContent}
        class="size-full min-h-fit"
      >
        <EditorInput
          placeholder="Note content..."
          class="rounded-sm border border-amber-600 bg-paper-editor px-3 py-2 text-base focus:outline-3 focus:outline-amber-300"
        />
      </Editor>
    </Form>
  );
}
