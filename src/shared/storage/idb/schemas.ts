import type { DBSchema } from "idb";
import type { EditorMode } from "#shared/editor/schema.ts";

interface NoteMetaIdb {
  id: string;
  mode: EditorMode;
  title: string;
  isCorrupt: boolean;
  createdAt: string;
  updatedAt: string;
}

interface NoteContentIdb {
  noteId: string;
  content: unknown; // lexical complex editor state here
}

export interface TakeANoteDbSchema extends DBSchema {
  note_meta: {
    key: NoteMetaIdb["id"];
    value: NoteMetaIdb;
    indexes: {
      updatedAt: NoteMetaIdb["updatedAt"];
    };
  };

  note_content: {
    key: NoteContentIdb["noteId"];
    value: NoteContentIdb;
  };
}
