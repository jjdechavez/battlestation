import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import Database from '@ioc:Adonis/Lucid/Database';
import GitProject from 'App/Models/GitProject';

export default class GitProjectsController {
  readonly VIEW_PATH = 'pages/dashboard/git-projects';

  public async index({ view, request }: HttpContextContract) {
    const page = request.input('page', 1);
    const limit = 10;

    const projects = await Database.from('git_projects')
      .orderBy('updated_at', 'desc')
      .paginate(page, limit);

    projects.baseUrl('/dashboard/git-projects');

    return view.render(`${this.VIEW_PATH}/manage`, { projects });
  }

  public async create({ view }: HttpContextContract) {
    return view.render(`${this.VIEW_PATH}/create`);
  }

  public async store({ request, auth, session, response }: HttpContextContract) {
    const projectSchema = schema.create({
      name: schema.string([rules.minLength(2)])
    });

    const payload = await request.validate({ schema: projectSchema });
    const project = await GitProject.create({
      name: payload.name,
      userId: auth.user?.id,
    });

    session.flash({
      message: 'Project created successfully!',
      status: 'success',
    });

    return response.redirect().toPath(`/dashboard/git-projects/${project.id}`);
  }

  public async show({ params, view }: HttpContextContract) {
    const project = await GitProject.findOrFail(params.id);
    return view.render(`${this.VIEW_PATH}/view`, { project });
  }

  public async edit({}: HttpContextContract) {}

  public async update({ request, params, view }: HttpContextContract) {
    const project = await GitProject.findOrFail(params.id);

    const projectSchema = schema.create({
      name: schema.string.optional(),
      isActive: schema.boolean.optional()
    });
    const payload = await request.validate({ schema: projectSchema });

    await project.merge(payload).save();

    return view.render('partials/git-projects/table_row_project', {
      id: project.id,
      name: project.name,
      is_active: project.isActive,
      created_at: project.createdAt.toFormat('DD'),
    });
  }

  public async destroy({ params, response }: HttpContextContract) {
    const project = await GitProject.findOrFail(params.id);
    await project.delete();

    return response.ok(null);
  }
}
