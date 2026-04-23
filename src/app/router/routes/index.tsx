import { createFileRoute } from "@tanstack/solid-router";
import Home from "@pages/home/home.page.tsx";

export const Route = createFileRoute("/")({
  component: Home,
});
