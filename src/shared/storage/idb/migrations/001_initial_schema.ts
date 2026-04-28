import type { IDBPDatabase } from "idb";

/**
 * Expected schema after applying version 1:
 *
 * **note:**
 * - `noteId` string (uuidv7), primary key
 * - `title` string
 * - `updatedAt` number (timestamp)
 *
 * **noteContent:**
 * - `noteId` string (uuidv7), primary key
 * - `content` string
 */
export function runInitialSchema(db: IDBPDatabase) {
  const noteStore = db.createObjectStore("note", { keyPath: "noteId" });
  noteStore.createIndex("updatedAt", "updatedAt");

  db.createObjectStore("noteContent", { keyPath: "noteId" });
}
