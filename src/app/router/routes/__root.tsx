import { createRootRoute } from "@tanstack/solid-router";
import RootLayout from "#app/layouts/root-layout.tsx";
import { NotFound } from "#pages/not-found/not-found.tsx";

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFound,
});
