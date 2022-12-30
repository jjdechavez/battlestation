import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import { string } from '@ioc:Adonis/Core/Helpers';
import ROLE_ALIAS from 'App/Constants/RoleAlias';
import Role from 'App/Models/Role';
import User from 'App/Models/User';

export default class UsersController {
  public async manage({ response, view, bouncer }: HttpContextContract) {
    if (await bouncer.with('UserPolicy').denies('viewList')) {
      return response.redirect().toPath('/dashboard');
    }

    const users = await User.query().orderBy('email');
    const roles = await Role.query().orderBy('name');

    return view.render('pages/dashboard/users/manage', { users, roles });
  }

  public async create({ response, view, bouncer }: HttpContextContract) {
    if (await bouncer.with('UserPolicy').denies('create')) {
      return response.redirect().toPath('/dashboard');
    }

    const roles = await Role.query().orderBy('name');

    return view.render('pages/dashboard/users/create', { roles });
  }

  public async store({
    request,
    response,
    bouncer,
    session,
  }: HttpContextContract) {
    if (await bouncer.with('UserPolicy').denies('create')) {
      return response.redirect().toPath('/dashboard');
    }

    const userSchema = schema.create({
      email: schema.string([rules.email(), rules.trim()]),
      firstName: schema.string([rules.minLength(2), rules.trim()]),
      lastName: schema.string([rules.minLength(2), rules.trim()]),
      roleAlias: schema.enum([ROLE_ALIAS.ADMIN, ROLE_ALIAS.MEMBER] as const),
    });

    const payload = await request.validate({ schema: userSchema });
    const password = string.generateRandom(8);
    const user = await User.create({
      ...payload,
      fullName: `${payload.firstName} ${payload.lastName}`,
      password,
    });

    console.log('password: ', password);
    session.flash({
      message: 'User created successfully!',
      status: 'success',
    });

    return response.redirect().toPath(`/dashboard/users/${user.id}`);
  }

  public async view({ view, response, bouncer, params }: HttpContextContract) {
    if (await bouncer.with('UserPolicy').denies('view')) {
      return response.redirect().toPath('/dashboard');
    }

    const user = await User.findOrFail(params.id);

    return view.render('pages/dashboard/users/view', {
      user: user.serialize(),
    });
  }

  public async edit({ response, view, bouncer, params }: HttpContextContract) {
    if (await bouncer.with('UserPolicy').denies('update')) {
      return response.redirect().toPath('/dashboard');
    }

    const user = await User.findOrFail(params.id);
    const roles = await Role.query().orderBy('name');

    return view.render('pages/dashboard/users/update', { user, roles });
  }

  public async update({
    request,
    response,
    bouncer,
    session,
    params,
    auth,
  }: HttpContextContract) {
    if (await bouncer.with('UserPolicy').denies('update')) {
      return response.redirect().toPath('/dashboard');
    }

    const user = await User.findOrFail(params.id);

    const userSchema = schema.create({
      email: schema.string([rules.email(), rules.trim()]),
      firstName: schema.string([rules.minLength(2), rules.trim()]),
      lastName: schema.string([rules.minLength(2), rules.trim()]),
      roleAlias: schema.enum([ROLE_ALIAS.ADMIN, ROLE_ALIAS.MEMBER] as const),
    });

    const payload = await request.validate({ schema: userSchema });
    await user
      .merge({
        ...payload,
        fullName: `${payload.firstName} ${payload.lastName}`,
      })
      .save();

    const isAuthUser = user.id === auth.user?.id;

    session.flash({
      message: 'User updated successfully!',
      status: 'success',
    });

    return isAuthUser && user.roleAlias !== ROLE_ALIAS.ADMIN
      ? response.redirect().toPath('/dashboard')
      : response.redirect().toPath(`/dashboard/users/${user.id}`);
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
