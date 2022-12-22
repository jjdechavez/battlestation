import { ObjectValue } from 'utils/typeObjectValues';

const ROLE_ALIAS = {
  ADMIN: 'ADMIN',
  MEMBER: 'MEMBER',
} as const;

export type RoleAlias = ObjectValue<typeof ROLE_ALIAS>;

export default ROLE_ALIAS;
