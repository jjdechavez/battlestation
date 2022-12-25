import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import ROLE_ALIAS from 'App/Constants/RoleAlias';
import Role from 'App/Models/Role';
import User from 'App/Models/User';

export default class UsersController {
  public async manage({ response, view, bouncer }: HttpContextContract) {
    if (await bouncer.denies('manageUsers')) {
      return response.redirect().toPath('/dashboard');
    }

    const users = await User.query().orderBy('email');
    const roles = await Role.query().orderBy('name');

    return view.render('dashboard/users/manage', { users, roles });
  }

  public async role({ request, response, params, auth }: HttpContextContract) {
    const roleSchema = schema.create({
      roleAlias: schema.string([
        rules.exists({ table: 'roles', column: 'alias' }),
      ]),
    });

    const payload = await request.validate({ schema: roleSchema });
    const user = await User.findOrFail(params.id);
    const isAuthUser = user.id === auth.user?.id;

    await user.merge(payload).save();

    return isAuthUser && user.roleAlias !== ROLE_ALIAS.ADMIN
      ? response.redirect().toPath('/dashboard')
      : response.redirect().back();
  }

  public async destroy({ response, params, auth }: HttpContextContract) {
    const user = await User.findOrFail(params.id);
    const isAuthUser = user.id === auth.user?.id;

    await user.delete();

    return isAuthUser
      ? response.redirect().toPath('/')
      : response.redirect().back();
  }
}
