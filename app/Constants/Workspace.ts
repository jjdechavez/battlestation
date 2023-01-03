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

export const WORKSPACE_TASK_PRIORITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT',
} as const;

export type WorkspaceTaskPriority = ObjectValue<
  typeof WORKSPACE_TASK_PRIORITY
>;
