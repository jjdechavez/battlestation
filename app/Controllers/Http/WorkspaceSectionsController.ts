import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import Workspace from 'App/Models/Workspace';
import WorkspaceSection from 'App/Models/WorkspaceSection';

export default class WorkspaceSectionsController {
  public async store({
    request,
    response,
    session,
    params,
  }: HttpContextContract) {
    const workspace = await Workspace.query()
      .where('id', params.id)
      .withCount('sections')
      .firstOrFail();

    const workspaceSectionSchema = schema.create({
      title: schema.string([rules.minLength(2)]),
    });

    const payload = await request.validate({ schema: workspaceSectionSchema });
    await WorkspaceSection.create({
      ...payload,
      position: workspace.$extras.sections_count + 1,
      workspaceId: params.id,
    });

    session.flash({
      message: 'Section created successfully!',
      status: 'success',
    });

    return response.redirect().back();
  }

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
