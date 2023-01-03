import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'
import WorkspaceSection from 'App/Models/WorkspaceSection'

export default class WorkspaceSectionPolicy extends BasePolicy {
	public async viewList(_user: User) {
    return true;
  }
	public async view(user: User, workspaceSection: WorkspaceSection) {
    if (user.id === workspaceSection.workspace.authorId) {
      return true;
    }
  }
	public async create(user: User) {}
	public async update(user: User, workspaceSection: WorkspaceSection) {}
	public async delete(user: User, workspaceSection: WorkspaceSection) {}
}
