import { ObjectValue } from 'utils/typeObjectValues';

const ROLE_STATUS = {
  ACTIVE: 'ACTIVE',
  DEACTIVATED: 'DEACTIVATED',
} as const;

export type RoleStatus = ObjectValue<typeof ROLE_STATUS>;

export default ROLE_STATUS;
