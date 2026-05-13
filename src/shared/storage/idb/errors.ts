import {
  AppError,
  type AppErrorOptions,
} from "#shared/lib/errors/app-error.ts";
import type { StoreNames } from "idb";
import type { TakeANoteDbSchema } from "#shared/storage/idb/schemas.ts";

export class MigrationError extends AppError<"IDB_MIGRATION_FAILED"> {
  public override readonly name = "MigrationError";
  public override readonly code = "IDB_MIGRATION_FAILED";
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

export class IdbUnknownError extends AppError<"IDB_UNKNOWN_FAILURE"> {
  public override readonly name = "IdbUnknownError";
  public override readonly code = "IDB_UNKNOWN_FAILURE";

  constructor(
    message = "An unknown indexedDB error occurred",
    options?: Omit<AppErrorOptions<"IDB_UNKNOWN_FAILURE">, "code">,
  ) {
    super(message, { ...options, code: "IDB_UNKNOWN_FAILURE" });
  }
}

type IdbAction = "create" | "read" | "update" | "delete";

type IdbErrorCode = `IDB_${Uppercase<IdbAction>}_FAILED`;

type ObjectStore = StoreNames<TakeANoteDbSchema>;

export class IdbOperationError extends AppError<IdbErrorCode> {
  public override readonly name = "IdbOperationError";
  public override readonly code: IdbErrorCode;
  public readonly action: IdbAction;
  public readonly store: ObjectStore;

  constructor(
    action: IdbAction,
    store: ObjectStore,
    message: string,
    options?: AppErrorOptions<IdbErrorCode>,
  );
  constructor(
    action: IdbAction,
    store: ObjectStore,
    options?: AppErrorOptions<IdbErrorCode>,
  );
  constructor(
    action: IdbAction,
    store: ObjectStore,
    messageOrOptions?: string | AppErrorOptions<IdbErrorCode>,
    options?: AppErrorOptions<IdbErrorCode>,
  ) {
    const resolvedMsg = typeof messageOrOptions === "string"
      ? messageOrOptions
      : IdbOperationError.getDefaultMessage(action, store);

    const resolvedOpts = typeof messageOrOptions === "string"
      ? options
      : messageOrOptions;

    const resolvedCode = resolvedOpts?.code ??
      IdbOperationError.getDefaultCode(action);

    super(resolvedMsg, {
      ...resolvedOpts,
      code: resolvedCode,
    });

    this.action = action;
    this.store = store;
    this.code = resolvedCode;
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
