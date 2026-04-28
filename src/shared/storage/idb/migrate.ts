import type { IDBPDatabase, IDBPTransaction } from "idb";
import { runInitialSchema } from "#shared/storage/idb/migrations/001_initial_schema.ts";
import { MigrationError } from "#shared/storage/idb/migrations/error.ts";

/**
 * @throws {MigrationError} when migration fails
 */
export function runMigrations(
  db: IDBPDatabase,
  oldVersion: number,
  _newVersion: number | null,
  _transaction: IDBPTransaction<unknown, string[], "versionchange">,
  _event: IDBVersionChangeEvent,
) {
  let versionBeingApplied = 0;

  try {
    if (oldVersion < 1) {
      versionBeingApplied = 1;
      runInitialSchema(db);
    }
  } catch (e) {
    throw new MigrationError(versionBeingApplied, { cause: e });
  }
}
