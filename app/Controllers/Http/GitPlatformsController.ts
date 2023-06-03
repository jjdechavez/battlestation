import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Route from '@ioc:Adonis/Core/Route'
import GitPlatform from 'App/Models/GitPlatform'
import GitProject from 'App/Models/GitProject'
import GitProjectService from 'App/Services/GitProjectService'

export default class GitPlatformsController {
  public async index({ view, params }: HttpContextContract) {
    const content = await GitProjectService.getContentByTab({ projectId: params.id, tab: 'platform' });

    return view.render(`partials/git-projects/table_body_platform`, {
      id: params.id,
      content
    })
  }

  public async create({ view, params, request }: HttpContextContract) {
    const qs = request.qs()
    const project = await GitProject.findOrFail(params.id)

    return view.render(`partials/git-projects/table_row_platform_form`, {
      project,
      id: project.id,
      tab: 'platform',
      status: qs.status
    })
  }

  public async store({ request, params, session, response }: HttpContextContract) {
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

    await GitPlatform.create({
      ...payload,
      projectId: params.id,
    })

    session.flash({
      message: 'Platform created successfully!',
      status: 'success',
    })

    response.header('HX-Trigger', 'newPlatform')
    return response.status(201)
  }

  public async edit({ params, view }: HttpContextContract) {
    const platform = await GitPlatform.findOrFail(params.platformId)
    return view.render('partials/git-projects/table_row_platform_form', {
      id: params.id,
      platform,
      status: 'edit'
    })
  }

  public async update({ request, params, view, response }: HttpContextContract) {
    const platform = await GitPlatform.findOrFail(params.platformId)

    const platformSchema = schema.create({
      name: schema.string([ rules.minLength(2) ])
    })

    const payload = await request.validate({
      schema: platformSchema,
      messages: {
        'name.minLength': 'Name length must have greater than 2 characters'
      }
    })

    await platform.merge(payload).save()

    const path = Route.makeUrl('git-projects.show', { id: params.id }, { qs: { tab: 'platform' } })
    response.header('HX-Push-Url', path)

    return view.render('partials/git-projects/table_row_platform', {
      platform,
      id: params.id
    })
  }

  public async destroy({ params, response }: HttpContextContract) {
    const platform = await GitPlatform.findOrFail(params.platformId)
    await platform.delete()

    return response.ok(null)
  }

  public async show({ view, params }: HttpContextContract) {
    const platform = await GitPlatform.findOrFail(params.platformId)
    return view.render('partials/git-projects/table_row_platform', { platform, id: params.id })
  }

  public async alias({ view, request, params }: HttpContextContract) {
    const body = request.only(['alias'])
    const qs = request.qs()
    const status: 'add' | 'edit' = qs.status

    let platform: GitPlatform | null = null
    if (status === 'add') {
      platform = await GitPlatform.findBy('alias', body.alias)
    } else if (status === 'edit') {
      const currentPlatform = await GitPlatform.find(qs.platformId)

      if (currentPlatform) {
        if (currentPlatform.alias === body.alias) {
          platform = null
        } else {
          platform = await GitPlatform.findBy('alias', body.alias)
        }
      }
    }

    return view.render('partials/git-projects/platform_alias_form', {
      exist: !!platform,
      alias: body.alias,
      tab: 'platform',
      id: params.id,
      platformId: qs.platformId,
      status,
    })
  }
}
