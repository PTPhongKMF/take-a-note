import { createSignal, Match } from "solid-js";
import { splitProps } from "solid-js";
import type { ComponentProps } from "solid-js";
import { Switch } from "solid-js";
import { c } from "#shared/lib/class-merger/c.ts";
import Icon from "#shared/ui/icon/icon.tsx";
import { createEffect } from "solid-js";

interface SaveIndicatorProps extends ComponentProps<"div"> {
  isDirty: boolean;
  isSaving: boolean;
}

export default function SaveStatusIndicator(props: SaveIndicatorProps) {
  const [local, others] = splitProps(props, ["class", "isDirty", "isSaving"]);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      {...others}
      class={c("flex items-center justify-end text-fluid-sm", local.class)}
    >
      <Switch>
        <Match when={local.isSaving}>
          <p class="flex animate-pulse items-center justify-center gap-2 font-semibold text-blue-800">
            <Icon name="cloud-sync" />
            <span class="truncate">Saving...</span>
          </p>
        </Match>
        <Match when={local.isDirty}>
          <p class="flex items-center justify-center gap-2 font-semibold text-orange-800">
            <Icon name="cloud-alert" />
            <span class="truncate">Unsaved changes</span>
          </p>
        </Match>
        <Match when={!local.isDirty}>
          <p class="flex items-center justify-center gap-2 italic">
            <Icon name="cloud-check" />
            <span class="truncate">
              All changes saved
            </span>
          </p>
        </Match>
      </Switch>
    </div>
  );
}
