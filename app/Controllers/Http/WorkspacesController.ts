import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import Database from '@ioc:Adonis/Lucid/Database';
import {
  WORKSPACE_TASK_PRIORITY,
  WORKSPACE_TYPE,
} from 'App/Constants/Workspace';
import Workspace from 'App/Models/Workspace';
import { objectToOption } from '../../../utils/form';

export default class WorkspacesController {
  public async index({ view, request, bouncer }: HttpContextContract) {
    await bouncer.with('WorkspacePolicy').authorize('viewList');

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

  public async create({ view, bouncer }: HttpContextContract) {
    await bouncer.with('WorkspacePolicy').authorize('create');

    const types = objectToOption(WORKSPACE_TYPE);

    return view.render('pages/dashboard/workspaces/create', { types });
  }

  public async store({
    request,
    response,
    session,
    auth,
    bouncer,
  }: HttpContextContract) {
    await bouncer.with('WorkspacePolicy').authorize('create');

    const workspaceSchema = schema.create({
      title: schema.string([rules.minLength(2), rules.maxLength(180)]),
      summary: schema.string.optional(),
      type: schema.enum(Object.keys(WORKSPACE_TYPE)),
    });

    const payload = await request.validate({ schema: workspaceSchema });
    const workspace = await Workspace.create({
      ...payload,
      type: WORKSPACE_TYPE[payload.type],
      authorId: auth.user?.id,
    });

    session.flash({
      message: 'Workspace created successfully!',
      status: 'success',
    });

    return response.redirect().toPath(`/dashboard/workspaces/${workspace.id}`);
  }

  public async show({ view, params, bouncer }: HttpContextContract) {
    const workspace = await Workspace.findOrFail(params.id);
    await workspace.load('sections', (sectionsQuery) => {
      sectionsQuery.preload('tasks', (tasksQuery) => {
        tasksQuery.orderBy('position', 'asc');
      });
    });

    await bouncer.with('WorkspacePolicy').authorize('view', workspace);

    const priorities = objectToOption(WORKSPACE_TASK_PRIORITY);

    return view.render('pages/dashboard/workspaces/view', {
      workspace,
      priorities,
    });
  }

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
