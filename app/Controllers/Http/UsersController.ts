import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import Role from 'App/Models/Role';
import User from 'App/Models/User';

export default class UsersController {
  public async manage({ view }: HttpContextContract) {
    const users = await User.query().orderBy('email');
    const roles = await Role.query().orderBy('name');

    return view.render('dashboard/users/manage', { users, roles });
  }

  public async role({ request, response, params }: HttpContextContract) {
    const roleSchema = schema.create({
      roleAlias: schema.string([
        rules.exists({ table: 'roles', column: 'alias' }),
      ]),
    });

    const payload = await request.validate({ schema: roleSchema });
    const user = await User.findOrFail(params.id);

    await user.merge(payload).save();

    return response.redirect().back();
  }
}
