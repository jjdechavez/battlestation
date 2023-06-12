import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import Database from '@ioc:Adonis/Lucid/Database';
import GitPlatform from 'App/Models/GitPlatform';
import GitTicket from 'App/Models/GitTicket'
import GitProjectService from 'App/Services/GitProjectService';
import { DateTime } from 'luxon';

export default class GitTicketsController {
  readonly PARTIAL_PATH = 'partials/git-projects';
  readonly PAGE_PATH = 'pages/dashboard/git-projects/tickets';

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
    await ticket.related('platforms').detach()

    await ticket.load('commits')
    await ticket.related('commits').detach()
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
      await ticket.load('commits')
      return view.render(`${this.PAGE_PATH}/view`, { id: params.id, ticket })
    }
    return view.render(`${this.PARTIAL_PATH}/table_row_ticket`, { id: params.id, ticket })
  }

  public async createCommit({ view, params }: HttpContextContract) {
    const platforms = await GitPlatform
      .query()
      .where('projectId', params.id)
      .select('id', 'alias', 'name')

    const platformOptions = GitProjectService.transformToPlatformOptions(platforms)
    const currentDate = DateTime.now().toFormat('yyyy-MM-dd\'T\'HH:mm')

    return view.render(`${this.PARTIAL_PATH}/table_row_commit_form`, {
      id: params.id,
      ticketId: params.ticketId,
      platformOptions,
      currentDate,
      status: 'add'
    })
  }

  public async storeCommit({ request, params, response } : HttpContextContract) {
    const commitSchema = schema.create({
      hashed: schema.string([ rules.minLength(6), rules.maxLength(6) ]),
      title: schema.string([ rules.minLength(1) ]),
      commitedAt: schema.date(),
      platform: schema.string([ rules.exists({ table: 'git_platforms', column: 'id' })])
    })

    const payload = await request.validate({ schema: commitSchema })
    console.log(payload)
    const trx = await Database.transaction()
    const ticket = await GitTicket.find(params.ticketId, { client: trx })

    if (ticket) {
      if (payload.platform) {
        const platform = await GitPlatform.findOrFail(payload.platform)
        console.log(platform)
        if (platform) {
          await ticket.related('platforms').attach([platform.id])
        }
      }

      await ticket.related('commits').create({
        hashed: payload.hashed,
        title: payload.title,
        commitedAt: payload.commitedAt,
        projectId: params.id,
      })
    }
    // await trx.commit()

    response.header('HX-Trigger', 'newCommit')
    return response.status(201)
  }

  public async commits({ view, params }: HttpContextContract) {
    const ticket = await GitTicket.findOrFail(params.ticketId)
    await ticket.load('commits')
    return view.render(`${this.PARTIAL_PATH}/table_body_commit`, {
      id: params.id,
      ticketId: params.ticketId,
      ticket,
      content: ticket.commits
    })
  }
}
