import { CriticalError } from "#shared/lib/errors/critical-error.ts";
import { AppError } from "#shared/lib/errors/app-error.ts";
import type { StoreNames } from "idb";
import type { TakeANoteDbSchema } from "#shared/storage/idb/schemas.ts";

export class MigrationError extends CriticalError {
  public override readonly name = "MigrationError";
  public readonly version: number;

  constructor(version: number, options?: ErrorOptions) {
    super(
      `IndexedDB migration failed while upgrading to version ${version}`,
      {
        ...options,
        metadata: {
          "Target Version": version,
          "Storage Supported": navigator.storage ? "Yes" : "No",
        },
      },
    );

    this.version = version;
  }
}

type IdbErrorCode =
  | "IDB_CREATE_FAILED"
  | "IDB_READ_FAILED"
  | "IDB_UPDATE_FAILED"
  | "IDB_DELETE_FAILED";

interface IdbOperationErrorOptions extends ErrorOptions {
  code?: IdbErrorCode;
}

type ObjectStore = StoreNames<TakeANoteDbSchema>;

type IdbAction = "create" | "read" | "update" | "delete";

export class IdbOperationError extends AppError<IdbErrorCode> {
  public override readonly name = "IdbOperationError";
  public readonly action: IdbAction;
  public readonly store: ObjectStore;

  constructor(
    action: IdbAction,
    store: ObjectStore,
    message: string,
    options?: IdbOperationErrorOptions,
  );
  constructor(
    action: IdbAction,
    store: ObjectStore,
    options?: IdbOperationErrorOptions,
  );

  constructor(
    action: IdbAction,
    store: ObjectStore,
    messageOrOptions?: string | IdbOperationErrorOptions,
    options?: IdbOperationErrorOptions,
  ) {
    const resolvedMsg = typeof messageOrOptions === "string"
      ? messageOrOptions
      : IdbOperationError.getDefaultMessage(action, store);

    const resolvedOpts = typeof messageOrOptions === "string"
      ? options
      : messageOrOptions;

    super(resolvedMsg, {
      ...resolvedOpts,
      code: resolvedOpts?.code ?? IdbOperationError.getDefaultCode(action),
    });

    this.action = action;
    this.store = store;
  }

  private static getDefaultMessage(
    action: IdbAction,
    store: ObjectStore,
  ): string {
    switch (action) {
      case "read":
        return `Failed to fetch data from the "${store}" store`;
      case "create":
        return `Failed to save a new record into the "${store}" store`;
      case "update":
        return `Failed to update a record in the "${store}" store`;
      case "delete":
        return `Failed to delete a record from the "${store}" store`;
    }
  }

  private static getDefaultCode(action: IdbAction): IdbErrorCode {
    switch (action) {
      case "create":
        return "IDB_CREATE_FAILED";
      case "read":
        return "IDB_READ_FAILED";
      case "update":
        return "IDB_UPDATE_FAILED";
      case "delete":
        return "IDB_DELETE_FAILED";
    }
  }
}
