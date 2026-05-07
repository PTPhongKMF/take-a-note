import { Outlet } from "@tanstack/solid-router";
import { Link } from "@tanstack/solid-router";
import Icon from "#shared/ui/icon/icon.tsx";

export default function RootLayout() {
  return (
    <div class="grid w-full auto-rows-auto grid-cols-1">
      <div class="grid min-h-dvh grid-rows-[auto_1fr]">
        <header class="@container/nav bg-yellow-200 px-[clamp(0.25rem,4dvi,3rem)] py-1 text-2xl text-walnut">
          <Link
            to="/"
            class="inline-block font-pencil text-fluid-4xl font-bold transition-all duration-200 hover:scale-105 hover:rotate-3 hover:text-amber-800"
          >
            Take a Note
          </Link>
        </header>

        <main class="@container/main w-full bg-background">
          <Outlet />
        </main>
      </div>

      <footer class="@container/footer grid grid-cols-2 items-center bg-amber-200 px-[clamp(0.25rem,2dvi,3rem)] py-1 text-fluid-xs">
        <p class="justify-self-start">Copyright © 2026 PTPhongKMF</p>

        <section class="flex flex-wrap items-center justify-end gap-x-4 gap-y-2 justify-self-end">
          <a
            href="https://github.com/ptphongkmf/take-a-note/issues"
            target="_blank"
            class="flex items-center justify-center gap-1 leading-none transition-all duration-200 hover:text-amber-800"
          >
            <Icon name="bug" class="size-[1em]" />
            <span>Report issues</span>
          </a>
          <a
            href="https://github.com/ptphongkmf/take-a-note/discussions"
            target="_blank"
            class="flex items-center justify-center gap-1 leading-none transition-all duration-200 hover:text-amber-800"
          >
            <Icon name="lightbulb" class="size-[1em]" />
            <span>Suggestions</span>
          </a>
        </section>
      </footer>
    </div>
  );
}
