import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer';
import User from 'App/Models/User';
import Workspace from 'App/Models/Workspace';
import ROLE_ALIAS from 'App/Constants/RoleAlias';

export default class WorkspacePolicy extends BasePolicy {
  public async viewList(_user: User) {
    return true;
  }

  public async view(user: User, workspace: Workspace) {
    if (user.id === workspace.authorId) {
      return true;
    }
  }

  public async create(user: User) {
    if (Object.values(ROLE_ALIAS).includes(user.roleAlias)) {
      return true;
    }
  }

  public async update(user: User, workspace: Workspace) {
    if (user.id === workspace.authorId) {
      return true;
    }
  }

  public async delete(user: User, workspace: Workspace) {
    if (user.id === workspace.authorId) {
      return true;
    }
  }
}
