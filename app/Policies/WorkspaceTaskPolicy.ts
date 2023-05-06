import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import WorkspaceTask from 'App/Models/WorkspaceTask'

export default class WorkspaceTaskPolicy extends BasePolicy {
	public async viewList(_user: User) {
    return true;
  }
	public async view(user: User, workspaceTask: WorkspaceTask) {
    if (user.id === workspaceTask.section.workspace.authorId) {
      return true;
    }
  }
	// public async create(user: User) {}
	// public async update(user: User, workspaceTask: WorkspaceTask) {}
	// public async delete(user: User, workspaceTask: WorkspaceTask) {}
}
