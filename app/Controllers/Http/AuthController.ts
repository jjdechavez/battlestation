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

    try {
      await auth.attempt(email, password);
    } catch {
      session.flash('errors', 'Email or Password invalid');
      session.flash('email', email);
      return response.redirect().back();
    }

    return response.redirect().toPath('/dashboard');
  }

  public async logout({ response, auth }: HttpContextContract) {
    await auth.logout();
    return response.redirect().toPath('/');
  }
}
