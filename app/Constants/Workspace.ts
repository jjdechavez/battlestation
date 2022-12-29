import { ObjectValue } from 'utils/typeObjectValues';

export const WORKSPACE_STATUS = {
  ACTIVE: 'ACTIVE',
  ARCHIVE: 'ARCHIVE',
} as const;

export type WorkspaceStatus = ObjectValue<typeof WORKSPACE_STATUS>;

export const WORKSPACE_TYPE = {
  PERSONAL: 'PERSONAL',
  WORK: 'WORK',
} as const;

export type WorkspaceType = ObjectValue<typeof WORKSPACE_TYPE>;
