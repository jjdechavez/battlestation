import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import GitTicket from 'App/Models/GitTicket'

export default class GitTicketsController {
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
    return response.status(200)
  }
}
