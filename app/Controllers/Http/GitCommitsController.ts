import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Database from '@ioc:Adonis/Lucid/Database'
import GitCommit from 'App/Models/GitCommit'
import GitPlatform from 'App/Models/GitPlatform'
import GitTicket from 'App/Models/GitTicket'
import GitProjectService from 'App/Services/GitProjectService'
import { DateTime } from 'luxon'

export default class GitCommitsController {
  readonly PARTIAL_PATH = 'partials/git-projects'
  readonly PAGE_PATH = 'pages/dashboard/git-projects/commits'

  public async index({ view, params }: HttpContextContract) {
    const content = await GitProjectService.getContentByTab({ projectId: params.id, tab: 'commit' });

    return view.render(`partials/git-projects/table_body_commit`, {
      id: params.id,
      content
    })
  }

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

    const platformOptions = GitProjectService.transformToPlatformOptions(platforms)
    const currentDate = DateTime.now().toFormat('yyyy-MM-dd\'T\'HH:mm')

    return view.render(`${this.PAGE_PATH}/create`, {
      id: params.id,
      ticketOptions,
      platformOptions,
      currentDate,
    })
  }

  public async store({ request, params, response } : HttpContextContract) {
    const body = request.body()
    if (typeof body['platform-data'] === 'string') {
      body['platform-data'] = [body['platform-data']]
    }
    request.updateBody(body)

    const commitSchema = schema.create({
      ticket: schema.string([ rules.exists({ table: 'git_tickets', column: 'id' }) ]),
      hashed: schema.string([ rules.minLength(6), rules.maxLength(6) ]),
      title: schema.string([ rules.minLength(1) ]),
      commitedAt: schema.date(),
      'platform-data': schema.array.optional().members(schema.string())
    })

    const payload = await request.validate({ schema: commitSchema })
    const trx = await Database.transaction()
    const ticket = await GitTicket.find(payload.ticket, { client: trx })

    if (ticket) {
      if (payload['platform-data']) {
        const platforms = await GitPlatform.findMany(payload['platform-data'])
        const platformIds = platforms.map(platform => platform.id)
        await ticket.related('platforms').attach(platformIds)
      }

      await ticket.related('commits').create({
        hashed: payload.hashed,
        title: payload.title,
        commitedAt: payload.commitedAt,
        projectId: params.id,
      })
    }
    await trx.commit()

    response.header('HX-Trigger', 'newCommit')
    return response.status(201)
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

  public async destroy({ response, params }: HttpContextContract) {
    const commit = await GitCommit.findOrFail(params.commitId)
    await commit.delete()

    response.header('HX-Trigger', 'newCommit')
    return response.status(201)
  }
}
