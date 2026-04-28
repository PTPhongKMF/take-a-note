import { createRootRoute } from "@tanstack/solid-router";
import Root from "#app/layouts/root.tsx";

export const Route = createRootRoute({ component: Root });
