import { createFileRoute } from "@tanstack/solid-router";
import Home from "#pages/home/home.tsx";
import {
  getNoteContent,
  getNoteMeta,
  NoteServiceError,
} from "#shared/api/services/note.ts";
import { Result } from "@praha/byethrow";
import { mapFromIdbToNote } from "#entities/note/api/mappers.ts";
import { notFound } from "@tanstack/solid-router";

export const Route = createFileRoute("/notes/$id")({
  loader: ({ params }) => {
    const result = Result.pipe(
      Result.succeed({ ...params }),
      Result.bind("note", (params) => getNoteMeta(params.id)),
      Result.bind("noteContet", (params) => getNoteContent(params.id)),
      Result.map((result) => mapFromIdbToNote(result.note, result.noteContet)),
      Result.mapError((e) => {
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
