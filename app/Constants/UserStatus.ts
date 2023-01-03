import { ObjectValue } from 'utils/typeObjectValues';

const USER_STATUS = {
  ACTIVE: 'ACTIVE',
  DEACTIVATED: 'DEACTIVATED',
} as const;

export type UserStatus = ObjectValue<typeof USER_STATUS>;

export default USER_STATUS;
