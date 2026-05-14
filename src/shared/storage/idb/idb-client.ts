import { createSignal } from "solid-js";
import { type IDBPDatabase, openDB } from "idb";
import { Result } from "@praha/byethrow";
import { runMigrations } from "#shared/storage/idb/migrate.ts";
import {
  IdbInitError,
  MigrationError,
} from "#shared/storage/idb/errors.ts";
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
export const [idbError, setIdbError] = createSignal<
  MigrationError | IdbInitError
>();

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

      return new IdbInitError(
        "Failed to initialize IndexedDB",
        {
          code: "IDB_INIT_FAILED",
          metadata: {
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
        },
      );
    },
  });

  // TODO: should we throw instead of set error? if we continue, the ui will call `idbClient` and still throw anyway
  // while we are showing error modal?
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
    throw new IdbInitError("IndexedDB is not initialized", {
      code: "IDB_NOT_INITIALIZED",
    });
  }

  return idbInstance;
}
