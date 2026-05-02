import { createRouter } from "@tanstack/solid-router";
import { routeTree } from "#app/router/routeTree.gen.ts";

export const router = createRouter({ routeTree });

declare module "@tanstack/solid-router" {
  interface Register {
    router: typeof router;
  }
}
