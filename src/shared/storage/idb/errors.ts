import {
  AppError,
  type AppErrorOptions,
} from "#shared/lib/errors/app-error.ts";
import type { StoreNames } from "idb";
import type { TakeANoteDbSchema } from "#shared/storage/idb/schemas.ts";

type IdbInitErrorCode = "IDB_INIT_FAILED" | "IDB_NOT_INITIALIZED";

export class IdbInitError extends AppError<IdbInitErrorCode> {
  public override readonly name = "IdbInitError";

  constructor(
    message: string,
    options: AppErrorOptions<IdbInitErrorCode>,
  ) {
    super(message, options);
  }
}

export class MigrationError extends AppError<"IDB_MIGRATION_FAILED"> {
  public override readonly name = "MigrationError";
  public readonly version: number;

  constructor(
    version: number,
    options?: Omit<AppErrorOptions<"IDB_MIGRATION_FAILED">, "code">,
  ) {
    super(
      `IndexedDB migration failed while upgrading to version ${version}`,
      { ...options, code: "IDB_MIGRATION_FAILED" },
    );

    this.version = version;
  }
}

type IdbAction = "read" | "write" | "delete";

type ObjectStore = StoreNames<TakeANoteDbSchema>;

type IdbOperationErrorCode =
  | `IDB_${Uppercase<IdbAction>}_FAILED`
  | "IDB_UNKNOWN_FAILURE";

export interface IdbOperationErrorOptions
  extends Omit<AppErrorOptions<IdbOperationErrorCode>, "code"> {
  code?: IdbOperationErrorCode;
  action?: IdbAction;
  store?: ObjectStore;
}

export class IdbOperationError extends AppError<IdbOperationErrorCode> {
  public override readonly name = "IdbOperationError";
  public readonly action?: IdbAction;
  public readonly store?: ObjectStore;

  constructor(message: string, options?: IdbOperationErrorOptions);
  constructor(options?: IdbOperationErrorOptions);
  constructor(
    messageOrOptions?: string | IdbOperationErrorOptions,
    options?: IdbOperationErrorOptions,
  ) {
    const resolvedOpts = typeof messageOrOptions === "string"
      ? options
      : messageOrOptions;

    const action = resolvedOpts?.action;
    const store = resolvedOpts?.store;
    const code = resolvedOpts?.code ?? IdbOperationError.getDefaultCode(action);

    const resolvedMsg = typeof messageOrOptions === "string"
      ? messageOrOptions
      : IdbOperationError.getDefaultMessage(action, store);

    super(resolvedMsg, { ...resolvedOpts, code });

    this.action = action;
    this.store = store;
  }

  private static getDefaultMessage(
    action?: IdbAction,
    store?: ObjectStore,
  ): string {
    const storeName = store ?? "unknown";

    switch (action) {
      case "read":
        return `Failed to fetch data from the "${storeName}" store`;
      case "write":
        return `Failed to write (insert or update) a record in the "${storeName}" store`;
      case "delete":
        return `Failed to delete a record from the "${storeName}" store`;
      default:
        return "An unknown IndexedDB error occurred";
    }
  }

  private static getDefaultCode(
    action?: IdbAction,
  ): IdbOperationErrorCode {
    switch (action) {
      case "read":
        return "IDB_READ_FAILED";
      case "write":
        return "IDB_WRITE_FAILED";
      case "delete":
        return "IDB_DELETE_FAILED";
      default:
        return "IDB_UNKNOWN_FAILURE";
    }
  }
}
