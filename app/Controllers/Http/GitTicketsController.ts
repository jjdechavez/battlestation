import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator';
import GitTicket from 'App/Models/GitTicket'
import GitProjectService from 'App/Services/GitProjectService';

export default class GitTicketsController {
  readonly PARTIAL_PATH = 'partials/git-projects';

  public async index({ params, view }: HttpContextContract) {
    const content = await GitProjectService.getContentByTab({ projectId: params.id, tab: 'ticket' });
    return view.render(`${this.PARTIAL_PATH}/table_body_ticket`, { id: params.id, content })
  }

  public async create({ view, params }: HttpContextContract) {
    return view.render(`${this.PARTIAL_PATH}/table_row_ticket_form`, { id: params.id })
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
    const ticket = await GitTicket.findOrFail(params.ticketId)
    await ticket.delete();

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
}
