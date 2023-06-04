import GitPlatform from "App/Models/GitPlatform"
import GitTicket from "App/Models/GitTicket"
import GitCommit from "App/Models/GitCommit"

export type GitProjectTab = 'platform' | 'ticket' | 'commit'

export default class GitProject {
  public static async getContentByTab({ projectId, tab }: { projectId: string, tab: GitProjectTab  }) {
    let content: unknown
    if (tab === 'platform') {
      content = await GitPlatform.query().where('projectId', projectId)
    }
    if (tab === 'ticket') {
      content = await GitTicket.query().where('projectId', projectId)
    }
    if (tab === 'commit') {
      content = await GitCommit.query().where('projectId', projectId)
    }

    return content ?? []
  }
}
