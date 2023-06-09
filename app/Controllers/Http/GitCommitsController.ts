import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import GitPlatform from 'App/Models/GitPlatform'
import GitTicket from 'App/Models/GitTicket'
import GitProjectService from 'App/Services/GitProjectService'

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

  public async appendPlatform({ params, request, view }: HttpContextContract) {
    const qs = request.qs()
    const currentPlatformIds: string | string[] = qs['platform-data']
    const currentPlatformQuery = typeof currentPlatformIds === 'string'
      ? [currentPlatformIds]
      : currentPlatformIds

    const availablePlatforms = await GitProjectService.getAvailablePlatforms({
      projectId: params.id,
      platformIds: currentPlatformQuery
    })
    const platformOptions = GitProjectService.transformToPlatformOptions(availablePlatforms)

    const currentPlatforms = await GitProjectService.getSelectedPlatforms({
      projectId: params.id,
      platformIds: currentPlatformQuery,
    })

    return view.render(`${this.PARTIAL_PATH}/commit_platform_field`, {
      id: params.id,
      platformOptions,
      currentPlatforms
    })
  }

  public async removePlatform({ params, request, view }: HttpContextContract) {
    const removePlatformId: string = params.platformId
    const currentPlatformIds: string | string[] = request.only(['platform-data'])['platform-data']
    let availablePlatformIds: string[] = []

    if (Array.isArray(currentPlatformIds)) {
      availablePlatformIds = currentPlatformIds.filter(platform => platform !== removePlatformId)
    } else if (currentPlatformIds !== removePlatformId) {
      availablePlatformIds = [currentPlatformIds]
    }

    const availablePlatforms = await GitProjectService.getAvailablePlatforms({
      projectId: params.id,
      platformIds: availablePlatformIds,
    })
    const availablePlatformOptions = GitProjectService.transformToPlatformOptions(availablePlatforms)

    const currentPlatforms = await GitProjectService.getSelectedPlatforms({
      projectId: params.id,
      platformIds: availablePlatformIds,
    })

    return view.render(`${this.PARTIAL_PATH}/commit_platform_field`, {
      id: params.id,
      platformOptions: availablePlatformOptions,
      currentPlatforms
    })
  }
}
