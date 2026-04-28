import { CriticalError } from "#shared/lib/errors/critical-error.ts";

export class MigrationError extends CriticalError {
  public override readonly name = "MigrationError";
  public readonly version: number;

  constructor(version: number, opts?: ErrorOptions) {
    super(
      `IndexedDB migration failed while upgrading to version ${version}`,
      {
        ...opts,
        metadata: {
          "Target Version": version,
          "Storage Supported": navigator.storage ? "Yes" : "No",
        },
      },
    );

    this.version = version;
  }
}
