import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class GitTicketsController {
  public async create({ view, params }: HttpContextContract) {
    return view.render('partials/git-projects/table_row_ticket_form', { id: params.id })
  }
}
