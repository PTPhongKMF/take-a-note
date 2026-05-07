import { createForm, Field, Form, getInput } from "@formisch/solid";
import { type ComponentProps, createSignal, splitProps } from "solid-js";
import { toTitleCase } from "@std/text/unstable-to-title-case";
import { toPascalCase } from "@std/text";
import { c } from "#shared/lib/class-merger/c.ts";
import { type NoteOutput, NoteSchema } from "#entities/note/model/schema.ts";
import { monotonicUlid } from "@std/ulid";
import { Editor, EditorInput } from "#shared/editor/lexical-editor.tsx";
import * as v from "@valibot/valibot";
import type { SerializedEditorState } from "lexical";
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
      <div class="p grid auto-rows-auto grid-cols-4 items-center gap-[clamp(0.25rem,0.5cqi,1rem)] px-8">
        <Field of={noteForm} path={["title"]}>
          {(field) => (
            <input
              {...field.props}
              value={field.input}
              placeholder="Note title..."
              class={`col-span-4 w-full self-start rounded-none border-b-3 outline-none border-transparent bg-transparent py-2 text-base font-semibold 
                transition-colors duration-200
                focus:border-amber-600`}
            />
          )}
        </Field>

        <Field of={noteForm} path={["format"]}>
          {(field) => (
            <Select
              value={field.input}
              onChange={(val) => field.onInput(val ?? "plain-text")}
              options={[...Object.values(EditorFormats), "test-wrong-value"]}
              placeholder="Select"
              itemComponent={(props) => (
                <SelectItem
                  item={props.item}
                  class="cursor-pointer gap-2 text-fluid-sm hover:bg-amber-200 active:bg-amber-200"
                >
                  {toPascalCase(props.item.rawValue)}
                </SelectItem>
              )}
              class="col-span-2 justify-start gap-2 justify-self-start"
            >
              <SelectHiddenSelect {...field.props} />

              <SelectTrigger
                aria-label="Fruit"
                class="h-fit w-full cursor-pointer gap-2 rounded-none border-0 border-b-3 border-transparent bg-transparent p-2 py-1 text-fluid-sm 
                focus:border-amber-600 focus:ring-0 focus:ring-offset-0 focus:outline-3"
              >
                <span class="font-normal">Format</span>

                <SelectValue<string>>
                  {(state) => toPascalCase(state.selectedOption())}
                </SelectValue>
              </SelectTrigger>
              <SelectContent class="border-amber-600 bg-paper-editor" />
            </Select>
          )}
        </Field>

        <p class="col-span-2 truncate text-end text-fluid-sm">
          TODO: add saving status here
        </p>
      </div>

      <Separator class="mx-auto w-[93%] bg-amber-800 " />

      <div class="flex flex-col gap-1.5 text-fluid-sm">
        <Editor
          mode={getInput(noteForm, { path: ["format"] }) ?? "plain-text"}
          value={noteContent()}
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
