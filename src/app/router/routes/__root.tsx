import { createRootRoute } from "@tanstack/solid-router";
import RootLayout from "@app/layout/root.layout.tsx";

export const Route = createRootRoute({ component: RootLayout });
