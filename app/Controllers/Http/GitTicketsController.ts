import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import Database from '@ioc:Adonis/Lucid/Database';
import GitCommit from 'App/Models/GitCommit';
import GitProject from 'App/Models/GitProject';
import GitTicket from 'App/Models/GitTicket'
import GitProjectService from 'App/Services/GitProjectService';
import { DateTime } from 'luxon';

export default class GitTicketsController {
  readonly PARTIAL_PATH = 'partials/git-projects';
  readonly PAGE_PATH = 'pages/dashboard/git-projects';

  public async index({ params, view }: HttpContextContract) {
    const content = await GitProjectService.getContentByTab({ projectId: params.id, tab: 'ticket' });
    return view.render(`${this.PARTIAL_PATH}/table_body_ticket`, { id: params.id, content })
  }

  public async create({ view, params, request }: HttpContextContract) {
    const qs = request.qs()
    return view.render(`${this.PARTIAL_PATH}/table_row_ticket_form`, {
      id: params.id,
      status: qs.status
    })
  }

  public async store({ request, params, response }: HttpContextContract) {
    const body = request.only(['name'])

    await GitTicket.create({
      name: body.name,
      projectId: params.id
    })

    response.header('HX-Trigger', 'newTicket')
    return response.status(201)
  }

  public async destroy({ params, response }: HttpContextContract) {
    const trx = await Database.transaction()
    const ticket = await GitTicket.findOrFail(params.ticketId, { client: trx })

    await ticket.load('commits')
    await Promise.all(ticket.commits.map(async (commit) => await commit.delete()))

    await ticket.delete()

    await trx.commit()

    response.header('HX-Trigger', 'newTicket')
    return response.status(204)
  }

  public async edit({ params, view }: HttpContextContract) {
    const ticket = await GitTicket.findOrFail(params.ticketId)
    return view.render(`${this.PARTIAL_PATH}/table_row_ticket_form`, { id: params.id, ticket, status: 'edit' })
  }

  public async update({ params, request, view }: HttpContextContract) {
    const ticket = await GitTicket.findOrFail(params.ticketId)
    const ticketSchema = schema.create({
      name: schema.string(),
    });
    const payload = await request.validate({ schema: ticketSchema });

    await ticket.merge(payload).save()

    return view.render(`${this.PARTIAL_PATH}/table_row_ticket`, { id: params.id, ticket })
  }

  public async show({ view, params, request }: HttpContextContract) {
    const ticket = await GitTicket.findOrFail(params.ticketId)
    const qs = request.qs()

    if (qs.redirect) {
      await ticket.load('commits', (commitsQuery) => {
        commitsQuery.preload('platform')
      })
      return view.render(`${this.PAGE_PATH}/tickets/view`, { id: params.id, ticket })
    }
    return view.render(`${this.PARTIAL_PATH}/table_row_ticket`, { id: params.id, ticket })
  }

  public async createCommit({ view, params, request }: HttpContextContract) {
    if (request.qs().status === 'idle') {
      return view.render(`${this.PARTIAL_PATH}/table_row_commit_form`, {
        id: params.id,
        ticketId: params.ticketId,
        status: 'idle'
      })
    }

    const currentPlatformIds = await GitProjectService.getTicketCurrentPlatformIds(params.ticketId)
    const platforms = await GitProjectService.getAvailablePlatforms({
      projectId: params.id,
      platformIds: currentPlatformIds,
    })

    const platformOptions = GitProjectService.transformToPlatformOptions(platforms)
    const currentDate = DateTime.now().toFormat('yyyy-MM-dd\'T\'HH:mm')

    return view.render(`${this.PARTIAL_PATH}/table_row_commit_form`, {
      id: params.id,
      ticketId: params.ticketId,
      platformOptions,
      currentDate,
      status: 'add',
    })
  }

  public async storeCommit({ request, params, response } : HttpContextContract) {
    const commitSchema = schema.create({
      hashed: schema.string([ rules.minLength(6), rules.maxLength(6) ]),
      title: schema.string([ rules.minLength(1) ]),
      commitedAt: schema.date(),
      platform: schema.string.optional([ rules.exists({ table: 'git_platforms', column: 'id' })])
    })

    const payload = await request.validate({ schema: commitSchema })
    const trx = await Database.transaction()
    const ticket = await GitTicket.findOrFail(params.ticketId, { client: trx })

    const commitPayload = {
      hashed: payload.hashed,
      title: payload.title,
      commitedAt: payload.commitedAt,
      projectId: params.id,
    };

    if (payload.platform) {
      Object.assign(commitPayload, { platformId: payload.platform })
    }

    await ticket.related('commits').create(commitPayload)
    await trx.commit()

    response.header('HX-Trigger', 'newCommit')
    return response.status(201)
  }

  public async commits({ view, params }: HttpContextContract) {
    const ticket = await GitTicket.findOrFail(params.ticketId)
    await ticket.load('commits', (commitsQuery) => {
      commitsQuery.preload('platform')
    })
    return view.render(`${this.PARTIAL_PATH}/table_body_commit`, {
      id: params.id,
      ticketId: params.ticketId,
      ticket,
      content: ticket.commits
    })
  }

  public async showCommit({ params, view }: HttpContextContract) {
    const commit = await GitCommit.findOrFail(params.commitId)
    await commit.load('platform')

    return view.render(`${this.PARTIAL_PATH}/table_row_commit`, {
      id: params.id,
      ticketId: params.ticketId,
      commit,
    })
  }

  public async editCommit({ params, view }: HttpContextContract) {
    const commit = await GitCommit.findOrFail(params.commitId)
    await commit.load('platform')

    const currentPlatformIds = await GitProjectService.getTicketCurrentPlatformIds(params.ticketId)
    const platforms = await GitProjectService.getAvailablePlatforms({
      projectId: params.id,
      platformIds: currentPlatformIds,
    })
    if (commit.platform) {
      platforms.unshift(commit.platform)
    }

    const platformOptions = GitProjectService.transformToPlatformOptions(platforms)
    const currentDate = DateTime.now().toFormat('yyyy-MM-dd\'T\'HH:mm')

    return view.render(`${this.PARTIAL_PATH}/table_row_commit_form`, {
      id: params.id,
      ticketId: params.ticketId,
      platformOptions,
      currentDate,
      commit: {
        id: commit.id,
        projectId: commit.id,
        hashed: commit.hashed,
        title: commit.title,
        commitedAt: commit.commitedAt.toFormat('yyyy-MM-dd\'T\'HH:mm'),
        createdAt: commit.createdAt,
        updatedAt: commit.updatedAt,
        platformId: commit.platformId,
        completedAt: commit.completedAt,
        ticketId: commit.ticketId,
      },
      status: 'edit',
    })
  }

  public async updateCommit({ params, request, view }: HttpContextContract) {
    const trx = await Database.transaction()
    const commit = await GitCommit.findOrFail(params.commitId, { client: trx })

    const commitSchema = schema.create({
      hashed: schema.string([ rules.minLength(6), rules.maxLength(6) ]),
      title: schema.string([ rules.minLength(1) ]),
      commitedAt: schema.date(),
      platform: schema.string.optional([ rules.exists({ table: 'git_platforms', column: 'id' })])
    })

    const payload = await request.validate({ schema: commitSchema })

    await commit.merge({
      hashed: payload.hashed,
      title: payload.title,
      commitedAt: payload.commitedAt,
      platformId: payload.platform,
    }).save()
    await trx.commit()

    if (payload.platform) {
      await commit.load('platform')
    }

    return view.render(`${this.PARTIAL_PATH}/table_row_commit`, {
      id: params.id,
      ticketId: params.ticketId,
      commit,
    })
  }

  public async trackTickets({ request, view, params }: HttpContextContract) {
    const qs = request.qs()
    if (typeof qs.ticketIds === 'string') {
      qs.ticketIds = [qs.ticketIds]
    }
    request.updateQs(qs)

    const project = await GitProject.findOrFail(params.id)
    const ticketIds: string[] = qs.ticketIds
    const tickets = await GitTicket
      .query()
      .whereIn('id', ticketIds)
      .preload('commits', (commitsQuery) => {
        commitsQuery.preload('platform')
      })

    if (request.headers()['hx-request']) {
      if (qs.type === 'trigger') {
        return view.render(`${this.PARTIAL_PATH}/table_row_track_commit`, {
          id: params.id,
          project,
          tickets,
          ticketIds,
        })
      } else {
        return view.render(`${this.PARTIAL_PATH}/hx_tickets_tracks`, {
          id: params.id,
          project,
          tickets,
          ticketIds,
        })
      }
    }

    return view.render(`${this.PAGE_PATH}/tickets/tracks`, {
      id: params.id,
      project,
      tickets,
      ticketIds,
    })
  }

  public async completeCommits({ request, response }: HttpContextContract) {
    const body = request.body()
    if (typeof body.commitIds === 'string') {
      body.commitIds = [body.commitIds]
    }
    request.updateBody(body)

    const commitIds: string[] = body.commitIds

    await GitCommit
      .query()
      .whereIn('id', commitIds)
      .update({ completedAt: new Date() })

    response.header('HX-Trigger', 'completedCommits')
    return response.status(201)
  }
}
