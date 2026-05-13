import { createRootRoute } from "@tanstack/solid-router";
import RootLayout from "#app/layouts/root-layout.tsx";
import { RootNotFound } from "#pages/not-found/root-not-found.tsx";
import RootFatalError from "#pages/fatal-error/root-fatal-error.tsx";
import { initIndexedDB } from "#shared/storage/idb/idb-client.ts";

export const Route = createRootRoute({
  beforeLoad: async () => {
    await initIndexedDB();
  },
  component: RootLayout,
  notFoundComponent: RootNotFound,
  errorComponent: RootFatalError,
});
