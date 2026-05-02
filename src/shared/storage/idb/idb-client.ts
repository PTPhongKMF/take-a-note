import { createSignal } from "solid-js";
import { type IDBPDatabase, openDB } from "idb";
import { Result } from "@praha/byethrow";
import { runMigrations } from "#shared/storage/idb/migrate.ts";
import { MigrationError } from "#shared/storage/idb/errors.ts";
import { CriticalError } from "#shared/lib/errors/critical-error.ts";
import type { TakeANoteDbSchema } from "#shared/storage/idb/schemas.ts";

const IDB_NAME = "takeanote-db";
const IDB_VERSION = 1;

export type IdbState =
  | "initializing"
  | "ready"
  | "blocked"
  | "blocking"
  | "failed"
  | "terminated";

export const [idbState, setIdbState] = createSignal<IdbState>("initializing");
export const [idbError, setIdbError] = createSignal<Error | undefined>(
  undefined,
);

let idbInstance: IDBPDatabase<TakeANoteDbSchema> | undefined = undefined;

export async function initIndexedDB() {
  const openDBResult = await Result.try({
    try: () =>
      openDB<TakeANoteDbSchema>(IDB_NAME, IDB_VERSION, {
        upgrade: runMigrations,
        blocked: () => setIdbState("blocked"),
        blocking: () => {
          setIdbState("blocking");

          if (idbInstance) {
            idbInstance.close();
            idbInstance = undefined;
          }
        },
        terminated: () => {
          setIdbState("terminated");
          idbInstance = undefined;
        },
      }),
    catch: (e) => {
      if (e instanceof MigrationError) {
        return e;
      }

      throw new CriticalError("Failed to initialize IndexedDB", {
        cause: e,
        metadata: { "Storage Supported": navigator.storage ? "Yes" : "No" },
      });
    },
  });

  if (Result.isFailure(openDBResult)) {
    setIdbState("failed");
    setIdbError(openDBResult.error);
    return;
  }

  setIdbState("ready");
  idbInstance = openDBResult.value;
}

export function idbClient() {
  if (!idbInstance) {
    throw new CriticalError("IndexedDB is not initialized");
  }

  return idbInstance;
}
