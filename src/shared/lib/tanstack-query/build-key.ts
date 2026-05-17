import { __compactKey__ } from "#shared/lib/tanstack-query/compact-key.ts";

type QueryKeyObjShape = {
  entity: string;
  scope?: string;
  id?: string;
  filters?: Record<string, unknown>;
};

export function buildQueryKey<const T extends QueryKeyObjShape>(keyObj: T) {
  return [__compactKey__(keyObj)] as const;
}

type MutationKeyObjShape = {
  entity: string;
  action: string;
  id?: string;
  variables?: Record<string, unknown>;
};

export function buildMutationKey<const T extends MutationKeyObjShape>(
  keyObj: T,
) {
  return [__compactKey__(keyObj)] as const;
}
