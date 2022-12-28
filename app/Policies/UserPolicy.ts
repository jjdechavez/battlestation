import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer';
import ROLE_ALIAS from 'App/Constants/RoleAlias';
import User from 'App/Models/User';

export default class UserPolicy extends BasePolicy {
  public async viewList(user: User) {
    return user.roleAlias === ROLE_ALIAS.ADMIN;
  }

  public async view(user: User) {
    return user.roleAlias === ROLE_ALIAS.ADMIN;
  }

  public async create(user: User) {
    return user.roleAlias === ROLE_ALIAS.ADMIN;
  }

  public async update(user: User) {
    return user.roleAlias === ROLE_ALIAS.ADMIN;
  }

  public async delete(user: User) {
    return user.roleAlias === ROLE_ALIAS.ADMIN;
  }
}
