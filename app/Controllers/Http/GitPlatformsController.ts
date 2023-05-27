import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Route from '@ioc:Adonis/Core/Route'
import GitPlatform from 'App/Models/GitPlatform'
import GitProject from 'App/Models/GitProject'

export default class GitPlatformsController {
  public async create({ view, params, request }: HttpContextContract) {
    const qs = request.qs()
    const project = await GitProject.findOrFail(params.id)

    return view.render(`partials/git-projects/table_row_platform_form`, {
      project,
      id: project.id,
      tab: qs.tab,
      status: qs.status
    })
  }

  public async store({ request, params, session, response, view }: HttpContextContract) {
    const platformSchema = schema.create({
      alias: schema.string([ rules.unique({ table: 'git_platforms', column: 'alias' }) ]),
      name: schema.string([ rules.minLength(2) ])
    })

    const payload = await request.validate({
      schema: platformSchema,
      messages: {
        'alias.unique': 'Alias is existed',
        'name.minLength': 'Name length must have greater than 2 characters'
      }
    })
    const platform = await GitPlatform.create({
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

    return view.render('partials/git-projects/table_row_platform', {
      platform,
      id: params.id,
      status: 'success'
    })
  }

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({ params, response }: HttpContextContract) {
    const platform = await GitPlatform.findOrFail(params.platformId)
    await platform.delete()

    return response.ok(null)
  }

  public async show({ view, params }: HttpContextContract) {
    const platform = await GitPlatform.findOrFail(params.platformId)
    return view.render('partials/git-projects/table_row_platform_form', { platform })
  }

  public async alias({ view, request, params }: HttpContextContract) {
    const body = request.only(['alias'])
    const tab = request.qs().tab
    const platform = await GitPlatform.findBy('alias', body.alias)

    return view.render('partials/git-projects/platform_alias_form', {
      exist: !!platform,
      alias: body.alias,
      tab,
      id: params.id,
    })
  }
}
