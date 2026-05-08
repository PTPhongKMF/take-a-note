import {
  createForm,
  Field,
  Form,
  getAllErrors,
  getInput,
} from "@formisch/solid";
import { type ComponentProps, splitProps } from "solid-js";
import { toTitleCase } from "@std/text/unstable-to-title-case";
import { toPascalCase } from "@std/text";
import { c } from "#shared/lib/class-merger/c.ts";
import { type NoteOutput, NoteSchema } from "#entities/note/model/schema.ts";
import { monotonicUlid } from "@std/ulid";
import { Editor, EditorInput } from "#shared/editor/lexical-editor.tsx";
import {
  Select,
  SelectContent,
  SelectHiddenSelect,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "#shared/ui/select/solidui-select.tsx";
import { EditorFormats } from "#shared/editor/schema.ts";
import { Separator } from "@kobalte/core/separator";
import { createEffect } from "solid-js";
import NoteFormatSwitcher from "#features/switch-note-format/ui/note-format-switcher.tsx";

interface NoteEditorProps extends
  Omit<
    ComponentProps<"form">,
    "onSubmit" | "children" | "action" | "method" | "onReset"
  > {
  note?: NoteOutput;
}

export default function NoteEditor(props: NoteEditorProps) {
  const [local, others] = splitProps(props, ["class", "note"]);

  const noteForm = createForm({
    schema: NoteSchema,
    initialInput: {
      id: local.note?.id ?? monotonicUlid(),
      format: local.note?.format ?? "plain-text",
      title: local.note?.title ?? "",
      content: local.note?.content ?? undefined,
      createdAt: local.note?.createdAt ?? Temporal.Now.instant().toString(),
      updatedAt: local.note?.updatedAt ?? Temporal.Now.instant().toString(),
    },
  });

  function handleSaveNote(output: NoteOutput) {
    console.log("Saving note:", { ...output });
  }

  createEffect(() => console.log(getAllErrors(noteForm)));

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
      <div class="p grid auto-rows-auto grid-cols-4 items-center gap-[clamp(0.25rem,0.5cqi,1rem)] px-8">
        <Field of={noteForm} path={["title"]}>
          {(field) => (
            <input
              {...field.props}
              value={field.input}
              placeholder="Note title..."
              class={`col-span-4 w-full self-start rounded-none border-b-3 px-1 outline-none border-transparent bg-transparent py-1 text-base font-bold 
                transition-colors duration-200
                focus:border-amber-600`}
            />
          )}
        </Field>

        <Field of={noteForm} path={["format"]}>
          {(field) => (
            <NoteFormatSwitcher
              {...field.props}
              value={field.input}
              onInput={field.onInput}
              class="col-span-2"
            />
          )}
        </Field>

        <p class="col-span-2 truncate text-end text-fluid-sm">
          TODO: add saving status here
        </p>
      </div>

      <Separator class="mx-auto w-[93%] bg-amber-800 " />

      <div class="flex flex-col gap-1.5 text-fluid-sm">
        <Field of={noteForm} path={["content"]}>
          {(field) => (
            <Editor
              format={getInput(noteForm, { path: ["format"] }) ?? "plain-text"}
              value={field.input}
              onInput={field.onInput}
              class="size-full min-h-fit"
            >
              <EditorInput
                placeholder="Note content..."
                class="rounded-sm border-amber-600 px-12 py-4 text-base outline-none"
              />
            </Editor>
          )}
        </Field>
      </div>
    </Form>
  );
}
