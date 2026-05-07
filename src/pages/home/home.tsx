import NoteEditor from "#pages/home/ui/note-editor.tsx";
import type { NoteOutput } from "#entities/note/model/schema.ts";

interface HomeProps {
  note?: NoteOutput;
}

export default function Home(props: HomeProps) {
  return (
    <div class="grid size-full grid-cols-1 gap-[clamp(0.5rem,2cqi,1rem)] p-[clamp(0.5rem,2cqi,1rem)] 
    @5xl/main:grid-cols-[minmax(15rem,1fr)_minmax(26rem,52rem)_minmax(15rem,1fr)]">
      <aside class="@container/sidebar hidden rounded-md border border-amber-200 p-4 @5xl/main:col-start-1 @5xl/main:block">
        <p class="text-fluid-sm text-amber-800">Left Sidebar...</p>
      </aside>

      <NoteEditor
        note={props.note}
        class="size-full @5xl/main:col-start-2"
      />

      <aside class="@container/sidebar hidden rounded-md border border-amber-200 p-4 @5xl/main:col-start-3 @5xl/main:block">
        <p class="text-fluid-sm text-amber-800">
          Right Sidebar...
        </p>

        <div class="flex flex-col justify-around gap-2">
          <button type="button">new note</button>
          <button type="button">import</button>
          <button type="button">export</button>
          <button type="button">share</button>
        </div>
      </aside>
    </div>
  );
}
