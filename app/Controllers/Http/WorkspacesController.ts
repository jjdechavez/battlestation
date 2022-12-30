import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import Database from '@ioc:Adonis/Lucid/Database';
import { WORKSPACE_TYPE } from 'App/Constants/Workspace';
import Workspace from 'App/Models/Workspace';
import { objectToOption } from '../../../utils/form';

export default class WorkspacesController {
  public async index({ view, request }: HttpContextContract) {
    const page = request.input('page', 1);
    const limit = 10;

    const workspaces = await Database.from('workspaces')
      .orderBy('updated_at', 'desc')
      .paginate(page, limit);

    workspaces.baseUrl('/workspaces');

    return view.render('pages/dashboard/workspaces/manage', {
      workspaces,
    });
  }

  public async create({ view }: HttpContextContract) {
    const types = objectToOption(WORKSPACE_TYPE);

    return view.render('pages/dashboard/workspaces/create', { types });
  }

  public async store({
    request,
    response,
    session,
    auth,
  }: HttpContextContract) {
    const workspaceSchema = schema.create({
      title: schema.string([rules.minLength(2), rules.maxLength(180)]),
      summary: schema.string.optional(),
      type: schema.enum(Object.keys(WORKSPACE_TYPE)),
    });

    const payload = await request.validate({ schema: workspaceSchema });
    const workspace = await Workspace.create({
      ...payload,
      authorId: auth.user?.id,
    });

    session.flash({
      message: 'Workspace created successfully!',
      status: 'success',
    });

    // TODO: Redirect to the view page
    return response.redirect().toPath('/dashboard/workspaces');
  }

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
