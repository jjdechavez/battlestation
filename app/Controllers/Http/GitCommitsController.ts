import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import GitPlatform from 'App/Models/GitPlatform'
import GitTicket from 'App/Models/GitTicket'

export default class GitCommitsController {
  readonly PARTIAL_PATH = 'partials/git-projects'
  readonly PAGE_PATH = 'pages/dashboard/git-projects/commits'

  public async create({ view, params }: HttpContextContract) {
    const tickets = await GitTicket
      .query()
      .where('projectId', params.id)
      .select('id', 'name')

    const ticketOptions = tickets.map(ticket => ({
      value: ticket.id,
      label: ticket.name
    }))

    const platforms = await GitPlatform
      .query()
      .where('projectId', params.id)
      .select('id', 'alias', 'name')

    const platformOptions = platforms.map(platform => ({
      value: platform.id,
      label: `[${platform.alias}] ${platform.name}`
    }))

    return view.render(`${this.PAGE_PATH}/create`, {
      id: params.id,
      ticketOptions,
      platformOptions
    })
  }

  public async platform({ params, request, view }: HttpContextContract) {
    const qs = request.qs()
    const addedPlatformId: string = params.platformId
    const currentPlatformIds: string | string[] = qs['platform-data']
    console.log({ addedPlatformId , currentPlatformIds })
    const currentPlatformQuery = typeof currentPlatformIds === 'string'
      ? [currentPlatformIds]
      : currentPlatformIds

    const availablePlatforms = await GitPlatform
      .query()
      .where('projectId', params.id)
      .andWhereNotIn('id', currentPlatformQuery)
      .select('id', 'alias', 'name')

    const platformOptions = availablePlatforms.map(platform => ({
      value: platform.id,
      label: `[${platform.alias}] ${platform.name}`
    }))

    const currentPlatforms = await GitPlatform
      .query()
      .where('projectId', params.id)
      .andWhereIn('id', currentPlatformQuery)
      .select('id', 'alias', 'name')

    return view.render(`${this.PARTIAL_PATH}/commit_platform_field`, {
      id: params.id,
      platformOptions,
      currentPlatforms
    })
  }
}
