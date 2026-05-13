import type { ErrorComponentProps } from "@tanstack/solid-router";

export default function RootFatalError(props: ErrorComponentProps) {
  return <div>root fatal error: {String(props.error)}</div>;
}
