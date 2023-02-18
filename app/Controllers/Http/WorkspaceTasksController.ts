import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { WORKSPACE_TASK_PRIORITY } from 'App/Constants/Workspace';
import Workspace from 'App/Models/Workspace';
import WorkspaceSection from 'App/Models/WorkspaceSection';
import WorkspaceTask from 'App/Models/WorkspaceTask';
import { objectToOption } from '../../../utils/form';

export default class WorkspaceTasksController {
  public async show({ view, params }: HttpContextContract) {
    const workspaceTask = await WorkspaceTask.findOrFail(params.taskId);

    // await bouncer.with('WorkspaceTaskPolicy').authorize('view', workspaceTask);

    const priorities = objectToOption(WORKSPACE_TASK_PRIORITY);

    return view.render('pages/dashboard/workspaces/tasks/show', {
      task: workspaceTask,
      priorities,
    });
  }

  public async create({ view, request }: HttpContextContract) {
    const { taskPosition, type } = request.qs();

    if (type === 'Add') {
      return view.render('partials/workspace/task_add');
    }

    const priorities = objectToOption(WORKSPACE_TASK_PRIORITY);

    return view.render('partials/workspace/task_form', {
      priorities,
      taskPosition: +taskPosition,
    });
  }

  public async store({ request, response, session }: HttpContextContract) {
    const taskSchema = schema.create({
      title: schema.string([rules.minLength(2), rules.maxLength(180)]),
      content: schema.string.optional(),
      priority: schema.string(),
      section_id: schema.string(),
    });

    const payload = await request.validate({ schema: taskSchema });

    const workspaceSection = await WorkspaceSection.query()
      .where('id', payload.section_id)
      .withCount('tasks')
      .firstOrFail();

    await WorkspaceTask.create({
      ...payload,
      priority: WORKSPACE_TASK_PRIORITY[payload.priority],
      position: workspaceSection.$extras.tasks_count + 1,
      sectionId: +payload.section_id,
    });

    await this.arrangePositionBySectionId(+payload.section_id);

    session.flash({
      message: 'Task created successfully!',
      status: 'success',
    });

    return response.redirect().back();
  }

  public async position({ request, params, view }: HttpContextContract) {
    const taskSchema = schema.create({
      taskIds: schema.array().members(schema.string()),
    });

    const { taskIds } = await request.validate({ schema: taskSchema });

    await this.arrangePosition(taskIds);

    const workspace = await Workspace.query()
      .where('id', params.id)
      .preload('sections', (sectionsQuery) => {
        sectionsQuery
          .orderBy('position', 'asc')
          .preload('tasks', (tasksQuery) => {
            tasksQuery.orderBy('position', 'asc');
          });
      })
      .firstOrFail();

    const priorities = objectToOption(WORKSPACE_TASK_PRIORITY);

    return view.render('partials/workspace/section_list', {
      workspace,
      priorities,
    });
  }

  public async detail({ view, params }: HttpContextContract) {
    const workspaceTask = await WorkspaceTask.findOrFail(params.taskId);
    const priorities = objectToOption(WORKSPACE_TASK_PRIORITY);

    return view.render('partials/workspace/task_show', {
      task: workspaceTask,
      priorities,
    });
  }

  public async edit({ view, params }: HttpContextContract) {
    const workspaceTask = await WorkspaceTask.findOrFail(params.taskId);
    const priorities = objectToOption(WORKSPACE_TASK_PRIORITY);

    return view.render('partials/workspace/task_edit', {
      task: workspaceTask,
      priorities,
    });
  }

  public async update({ request, params, view }: HttpContextContract) {
    const taskSchema = schema.create({
      title: schema.string([rules.minLength(2), rules.maxLength(180)]),
      content: schema.string.nullable(),
      priority: schema.enum(Object.values(WORKSPACE_TASK_PRIORITY)),
    });

    const payload = await request.validate({ schema: taskSchema });
    const workspaceTask = await WorkspaceTask.findOrFail(params.taskId);

    workspaceTask.merge(payload);
    await workspaceTask.save();

    const priorities = objectToOption(WORKSPACE_TASK_PRIORITY);

    return view.render('partials/workspace/task_show', {
      task: workspaceTask,
      priorities,
      message: 'Task updated successfully!',
      status: 'success',
    });
  }

  public async destroy({ params, response, request }: HttpContextContract) {
    const workspaceTask = await WorkspaceTask.findOrFail(params.taskId);
    await workspaceTask.delete();

    const qs = request.qs();
    if (qs.redirect === 'true') {
      response.header('HX-Redirect', `/dashboard/workspaces/${params.id}`);
    }
  }

  private async arrangePosition(taskIds: string[]) {
    await Promise.all(
      taskIds.map(async (taskId, index) => {
        const task = await WorkspaceTask.findOrFail(taskId);
        task.position = index;
        await task.save();
        return task;
      })
    );
  }

  private async arrangePositionBySectionId(sectionId: number) {
    const workspaceTasks = await WorkspaceTask.query()
      .where('sectionId', sectionId)
      .select('id');
    const taskIds = workspaceTasks.map((task) => task.id);

    await Promise.all(
      taskIds.map(async (taskId, index) => {
        const task = await WorkspaceTask.findOrFail(taskId);
        task.position = index;
        task.sectionId = sectionId;
        await task.save();
        return task;
      })
    );
  }
}
