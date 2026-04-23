import { Outlet } from "@tanstack/solid-router";
import { Link } from "@tanstack/solid-router";
import Icon from "@shared/components/icon/icon.tsx";

export default function RootLayout() {
  return (
    <div class="flex w-full flex-col">
      <div class="grid min-h-dvh grid-rows-[auto_1fr]">
        <header class="@container/nav bg-yellow-200 px-12 py-1 text-2xl  text-walnut">
          <Link
            to="/"
            class="font-pencil text-f4xl font-bold transition-all duration-200 hover:text-amber-800"
          >
            Take a Note!
          </Link>
        </header>

        <main class="@container/main w-full bg-paper">
          <Outlet />
        </main>
      </div>

      <footer class="@container/footer grid grid-cols-2 items-center justify-items-center bg-amber-200 px-12 py-1 text-fxs">
        <p class="justify-self-start">Copyright © 2026 PTPhongKMF</p>
        <a
          href="https://github.com/ptphongkmf/take-a-note/issues"
          target="_blank"
          class="flex items-center justify-center gap-1 justify-self-end leading-none transition-all duration-200 hover:text-amber-800"
        >
          <Icon name="bug" class="size-[1em]" />
          <span>Report issues</span>
        </a>
      </footer>
    </div>
  );
}
