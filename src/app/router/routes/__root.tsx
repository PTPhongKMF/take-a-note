import { createRootRoute } from "@tanstack/solid-router";
import RootLayout from "#app/layouts/root-layout.tsx";
import { RootNotFound } from "#pages/not-found/root-not-found.tsx";
import RootFatalError from "#pages/fatal-error/root-fatal-error.tsx";
import { initIndexedDB } from "#shared/storage/idb/idb-client.ts";
import { QueryClientProvider } from "@tanstack/solid-query";
import { queryClient } from "#shared/api/query-client.ts";

export const Route = createRootRoute({
  beforeLoad: async () => {
    await initIndexedDB();
  },
  component: () => (
    <QueryClientProvider client={queryClient}>
      <RootLayout />
    </QueryClientProvider>
  ),
  notFoundComponent: RootNotFound,
  errorComponent: RootFatalError,
});
