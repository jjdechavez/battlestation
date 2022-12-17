import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import User from 'App/Models/User';

export default class AuthController {
  public async register({
    request,
    response,
    auth,
    session,
  }: HttpContextContract) {
    const userSchema = schema.create({
      email: schema.string([rules.email(), rules.trim()]),
      password: schema.string([rules.minLength(8), rules.confirmed()]),
      firstName: schema.string([rules.minLength(2), rules.trim()]),
      lastName: schema.string([rules.minLength(2), rules.trim()]),
      roleAlias: schema.string(),
    });

    const payload = await request.validate({ schema: userSchema });
    const user = await User.create({
      ...payload,
      fullName: `${payload.firstName} ${payload.lastName}`,
    });

    await auth.login(user);

    session.flash('success', 'Account created successfully');
    return response.redirect().toPath('/');
  }

  public async login({
    request,
    response,
    auth,
    session,
  }: HttpContextContract) {
    const { email, password } = request.only(['email', 'password']);

    let role = '';
    try {
      const result = await auth.attempt(email, password);
      role = result.roleAlias;
    } catch (error) {
      session.flash('errors', 'Email or Password invalid');
      return response.redirect().back();
    }

    return role === 'ADMIN'
      ? response.redirect().toPath('/dashboard')
      : response.redirect().toPath('/');
  }

  public async logout({ response, auth }: HttpContextContract) {
    await auth.logout();
    return response.redirect().toPath('/');
  }
}
