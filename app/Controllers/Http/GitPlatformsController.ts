import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Route from '@ioc:Adonis/Core/Route'
import GitPlatform from 'App/Models/GitPlatform'
import GitProject from 'App/Models/GitProject'

export default class GitPlatformsController {
  public async create({ view, params }: HttpContextContract) {
    const project = await GitProject.findOrFail(params.id)
    return view.render(`pages/dashboard/git-projects/view`, { project })
  }

  public async store({ request, params, session, response, view }: HttpContextContract) {
    const platformSchema = schema.create({
      alias: schema.string([ rules.unique({ table: 'git_platforms', column: 'alias' }) ]),
      name: schema.string([ rules.minLength(2) ])
    })

    const payload = await request.validate({ schema: platformSchema })
    await GitPlatform.create({
      ...payload,
      projectId: params.id,
    })

    session.flash({
      message: 'Platform created successfully!',
      status: 'success',
    })

    const qs = request.qs()
    const path = Route.makeUrl('git-projects.show', { id: params.id }, { qs })
    response.header('HX-Push-Url', path)

    return view.render('partials/git-projects/tab')
  }

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({ params, response }: HttpContextContract) {
    const platform = await GitPlatform.findOrFail(params.platformId)
    await platform.delete()

    return response.ok(null)
  }
}
