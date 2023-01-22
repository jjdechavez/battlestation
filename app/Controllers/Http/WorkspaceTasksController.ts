import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { WORKSPACE_TASK_PRIORITY } from 'App/Constants/Workspace';
import WorkspaceTask from 'App/Models/WorkspaceTask';

export default class WorkspaceTasksController {
  public async index({}: HttpContextContract) {}

  public async create({}: HttpContextContract) {
  }

  public async store({
    request,
    response,
    session,
    params,
  }: HttpContextContract) {
    const workspaceSection = await WorkspaceSection.query()
      .where('id', params.sectionId)
      .withCount('tasks')
      .firstOrFail();

    const taskSchema = schema.create({
      title: schema.string([rules.minLength(2), rules.maxLength(180)]),
      content: schema.string.optional(),
      priority: schema.string(),
    });

    const payload = await request.validate({ schema: taskSchema });
    await WorkspaceTask.create({
      ...payload,
      priority: WORKSPACE_TASK_PRIORITY[payload.priority],
      position: workspaceSection.$extras.tasks_count + 1,
      sectionId: params.sectionId,
    });

    session.flash({
      message: 'Task created successfully!',
      status: 'success',
    });

    return response.redirect().back();
  }

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
