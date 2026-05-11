import type { ComponentProps } from "solid-js";
import { splitProps } from "solid-js";
import {
  Select,
  SelectContent,
  SelectHiddenSelect,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "#shared/ui/select/solidui-select.tsx";
import { type EditorFormat, EditorFormats } from "#shared/editor/schema.ts";
import { toPascalCase } from "@std/text";
// import { toTitleCase } from "@std/text/unstable-to-title-case";
import { c } from "#shared/lib/class-merger/c.ts";

interface NoteFormatSwitcherProps
  extends Omit<ComponentProps<"select">, "value" | "onInput"> {
  value?: EditorFormat;
  onInput: (value: EditorFormat) => void;
}

export default function NoteFormatSwitcher(props: NoteFormatSwitcherProps) {
  const [local, others] = splitProps(props, ["value", "onInput", "class"]);

  return (
    <Select
      value={local.value}
      onChange={(val) => local.onInput(val ?? "plain-text")}
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
      class={c(
        "flex items-center justify-center gap-0.75 justify-self-start",
        local.class,
      )}
    >
      <SelectHiddenSelect {...others} />

      <SelectLabel class="border-b-3 border-transparent font-normal">
        Format:
      </SelectLabel>

      <SelectTrigger
        aria-label="Fruit"
        class="h-fit w-full cursor-pointer gap-2 rounded-none border-0 border-b-3 border-transparent bg-transparent p-2 py-1 text-fluid-sm 
                  focus:border-amber-600 focus:ring-0 focus:ring-offset-0 focus:outline-3"
      >
        <SelectValue<string>>
          {(state) => toPascalCase(state.selectedOption())}
        </SelectValue>
      </SelectTrigger>
      <SelectContent class="border-amber-600 bg-paper-editor" />
    </Select>
  );
}
