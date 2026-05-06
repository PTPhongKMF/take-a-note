import { createFileRoute } from "@tanstack/solid-router";
import Home from "#pages/home/home.tsx";
import { getNote, NoteServiceError } from "#shared/api/services/note.ts";
import { Result } from "@praha/byethrow";
import { notFound } from "@tanstack/solid-router";

export const Route = createFileRoute("/notes/$id")({
  loader: ({ params }) => {
    const result = Result.pipe(
      Result.succeed({ ...params }),
      Result.andThen((params) => getNote(params.id)),
      Result.mapError((e) => {
        // TODO: how to handle "NOTE_CONTENT_NOT_FOUND" gracefully when meta exist?, make it blank new state?
        if (e instanceof NoteServiceError && e.code === "NOTE_NOT_FOUND") {
          return notFound();
        }

        return e;
      }),
      // TODO: handle vlaidaiton error, this more like isCorrupt state...
    );

    return Result.unwrap(result);
  },
  component: () => {
    const note = Route.useLoaderData();
    return <Home note={note()} />;
  },
});
