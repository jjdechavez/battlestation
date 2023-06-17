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

  public static async getAvailablePlatforms(
    { projectId, platformIds }: { projectId: string, platformIds: string [] }
  ) {
    const availablePlatforms = await GitPlatform
      .query()
      .where('projectId', projectId)
      .andWhereNotIn('id', platformIds)
      .select('id', 'alias', 'name')

    return availablePlatforms
  }

  public static async getSelectedPlatforms(
    { projectId, platformIds }: { projectId: string, platformIds: string [] }
  ) {
    const selectedPlatforms = await GitPlatform
      .query()
      .where('projectId', projectId)
      .andWhereIn('id', platformIds)
      .select('id', 'alias', 'name')

    return selectedPlatforms
  }

  public static transformToPlatformOptions(platforms: GitPlatform[]) {
    const platformOptions = platforms.map(platform => ({
      value: platform.id,
      label: `[${platform.alias}] ${platform.name}`
    }))

    return platformOptions
  }

  public static async getTicketCurrentPlatformIds(ticketId: string) {
    const ticket = await GitTicket
      .query()
      .where('id', ticketId)
      .preload('commits', (commitsQuery) => {
        commitsQuery.select('platformId')
      })
      .first()
    const currentPlatformIds = ticket?.commits.map(commit => commit.platformId) ?? []
    return currentPlatformIds
  }
}
