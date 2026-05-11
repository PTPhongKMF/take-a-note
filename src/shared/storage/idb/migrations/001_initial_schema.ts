import type { IDBPDatabase } from "idb";

/**
 * Expected schema after applying version 1:
 *
 * **noteMeta:**
 * - `id` string (ULID), primary key
 * - `title` string
 * - `format` string, "plain-text" | "markdown" | "rich-text"
 * - `isCorrupt` boolean
 * - `createdAt` number (ms since epoch)
 * - `updatedAt` number (ms since epoch)
 *
 * **noteContent:**
 * - `noteId` string (ULID), primary key, same as `id` in noteMeta
 * - `content` object (Lexical AST)
 */
export function runInitialSchema(db: IDBPDatabase) {
  const noteStore = db.createObjectStore("note_meta", { keyPath: "id" });
  noteStore.createIndex("updatedAt", "updatedAt");

  db.createObjectStore("note_content", { keyPath: "noteId" });
}
