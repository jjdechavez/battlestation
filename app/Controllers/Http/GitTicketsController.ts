import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import GitTicket from 'App/Models/GitTicket'
import GitProjectService from 'App/Services/GitProjectService';

export default class GitTicketsController {
  public async index({ params, view }: HttpContextContract) {
    const content = await GitProjectService.getContentByTab({ projectId: params.id, tab: 'ticket' });
    return view.render('partials/git-projects/table_body_ticket', { id: params.id, content })
  }

  public async create({ view, params }: HttpContextContract) {
    return view.render('partials/git-projects/table_row_ticket_form', { id: params.id })
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
}
