import NoteEditor from "#pages/home/ui/note-editor.tsx";
import type { NoteOutput } from "#entities/note/model/schema.ts";

interface HomeProps {
  note?: NoteOutput;
}

export default function Home(props: HomeProps) {
  return (
    <div class="grid size-full grid-cols-1 gap-[clamp(0.5rem,2cqi,1rem)] p-[clamp(0.5rem,2cqi,1rem)] @5xl/main:grid-cols-[minmax(15rem,1fr)_minmax(26rem,50rem)_minmax(15rem,1fr)]">
      <aside class="@container/sidebar hidden rounded-md border border-amber-200 bg-amber-100/50 p-4 @5xl/main:col-start-1 @5xl/main:block">
        <p class="text-fsm text-amber-800">Left Sidebar...</p>
      </aside>

      <NoteEditor note={props.note} class="size-full @5xl/main:col-start-2" />

      <aside class="@container/sidebar hidden rounded-md border border-amber-200 bg-amber-100/50 p-4 @5xl/main:col-start-3 @5xl/main:block">
        <p class="text-fsm text-amber-800">Right Sidebar...</p>
      </aside>
    </div>
  );
}
