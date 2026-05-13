import type { IDBPDatabase, IDBPTransaction, StoreNames } from "idb";
import { runInitialSchema } from "#shared/storage/idb/migrations/001_initial_schema.ts";
import { MigrationError } from "#shared/storage/idb/errors.ts";
import type { TakeANoteDbSchema } from "#shared/storage/idb/schemas.ts";

/**
 * @throws {MigrationError} when migration fails
 */
export function runMigrations(
  rawDb: IDBPDatabase<TakeANoteDbSchema>,
  oldVersion: number,
  _newVersion: number | null,
  rawTransaction: IDBPTransaction<
    TakeANoteDbSchema,
    StoreNames<TakeANoteDbSchema>[],
    "versionchange"
  >,
  _event: IDBVersionChangeEvent,
) {
  const db = rawDb as IDBPDatabase;
  const _transaction = rawTransaction as unknown as IDBPTransaction;

  let versionBeingApplied = 0;

  try {
    if (oldVersion < 1) {
      versionBeingApplied = 1;
      runInitialSchema(db);
    }
  } catch (e) {
    throw new MigrationError(versionBeingApplied, {
      metadata: {
        "Target Migration Version": versionBeingApplied,
        "Is IndexedDB Supported": (typeof window !== "undefined" &&
            !!globalThis.indexedDB)
          ? "Yes"
          : "No",
        "Is Storage Api Supported": (typeof navigator !== "undefined" &&
            !!navigator.storage)
          ? "Yes"
          : "No",
      },
      cause: e,
    });
  }
}
