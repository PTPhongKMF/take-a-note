/* @refresh reload */
import { render } from "solid-js/web";
import { RouterProvider } from "@tanstack/solid-router";
import { router } from "@app/router/router.ts";
import "@app/styles/styles.global.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found");
}

render(() => <RouterProvider router={router} />, root);
