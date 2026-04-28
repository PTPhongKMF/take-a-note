import { NoteProvider } from "#entities/note/note.provider.tsx";

export default function Home() {
  return (
    <NoteProvider>
      <div class="grid size-full grid-cols-1 grid-rows-[auto_1fr] gap-[clamp(0.5rem,2cqi,1rem)] p-[clamp(0.5rem,2cqi,1rem)] 
      @5xl/main:grid-cols-[minmax(15rem,1fr)_minmax(26rem,50rem)_minmax(15rem,1fr)]">
        <aside class="@container/sidebar hidden rounded-md border border-amber-200 bg-amber-100/50 p-4 
        @5xl/main:col-start-1 @5xl/main:row-span-2 @5xl/main:block">
          <p class="text-fsm text-amber-800">Left Sidebar...</p>
        </aside>

        <input
          placeholder="Note title..."
          class="w-full rounded-sm border border-amber-600 bg-paper-editor px-3 py-2 text-base font-semibold focus:outline-3 focus:outline-amber-300 
          @5xl/main:col-start-2 @5xl/main:row-start-1"
        />

        <textarea
          placeholder="Note content..."
          class="size-full min-h-fit resize-y rounded-sm border border-amber-600 bg-paper-editor px-3 py-2 text-base focus:outline-3 focus:outline-amber-300 
          @5xl/main:col-start-2 @5xl/main:row-start-2"
        />

        <aside class="@container/sidebar hidden rounded-md border border-amber-200 bg-amber-100/50 p-4 
        @5xl/main:col-start-3 @5xl/main:row-span-2 @5xl/main:block">
          <p class="text-fsm text-amber-800">Right Sidebar...</p>
        </aside>
      </div>
    </NoteProvider>
  );
}
