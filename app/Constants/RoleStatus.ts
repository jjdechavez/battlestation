const ROLE_STATUS = {
  ACTIVE: 'ACTIVE',
  DEACTIVATED: 'DEACTIVATED',
} as const;

type ObjectValue<T> = T[keyof T];

export type RoleStatus = ObjectValue<typeof ROLE_STATUS>;

export default ROLE_STATUS;
