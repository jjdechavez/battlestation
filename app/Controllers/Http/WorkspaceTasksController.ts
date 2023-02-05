import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { WORKSPACE_TASK_PRIORITY } from 'App/Constants/Workspace';
import Workspace from 'App/Models/Workspace';
import WorkspaceSection from 'App/Models/WorkspaceSection';
import WorkspaceTask from 'App/Models/WorkspaceTask';
import { objectToOption } from '../../../utils/form';

export default class WorkspaceTasksController {
  public async show({ view, params, bouncer }: HttpContextContract) {
    const workspaceTask = await WorkspaceTask.findOrFail(params.taskId);

    // await bouncer.with('WorkspaceTaskPolicy').authorize('view', workspaceTask);

    const priorities = objectToOption(WORKSPACE_TASK_PRIORITY);
    console.log(workspaceTask)

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

    // TODO: reArrange the position of each task
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

  public async drag({ request, params, view }: HttpContextContract) {
    const body = request.body();
    // Weird behaviour when receiving one array it turns to string
    const isTypeString = typeof body.taskIds === 'string';

    const taskSchema = schema.create({
      taskIds: isTypeString
        ? schema.string()
        : schema.array().members(schema.string()),
    });

    const payload = await request.validate({ schema: taskSchema });
    const taskIds = this.toTaskIds(payload.taskIds);
    await this.arrangePositionAndSectionId(taskIds, params.sectionId);

    const workspaceSection = await WorkspaceSection.query()
      .where('id', params.sectionId)
      .preload('tasks', (taskQuery) => {
        taskQuery.orderBy('position', 'asc');
      })
      .firstOrFail();

    return view.render('partials/workspace/task_list', {
      id: params.id,
      sectionId: params.sectionId,
      tasks: workspaceSection.tasks,
    });
  }

  private toTaskIds(taskIds: string | string[]): string[] {
    if (typeof taskIds === 'object') return taskIds as string[];

    return [taskIds];
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

  private async arrangePositionAndSectionId(
    taskIds: string[],
    sectionId: number
  ) {
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
