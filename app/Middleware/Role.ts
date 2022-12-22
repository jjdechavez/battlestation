import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import RoleAlias from 'App/Constants/RoleAlias';

export default class Role {
  public async handle(
    { response, auth }: HttpContextContract,
    next: () => Promise<void>,
    guards: string[]
  ) {
    const roleAliases = guards.map((guard) => RoleAlias[guard.toUpperCase()]);

    if (!roleAliases.includes(auth.user?.roleAlias)) {
      return response.unauthorized({
        error: `This is restricted to ${guards.join(', ')} users`,
      });
    }

    // code for middleware goes here. ABOVE THE NEXT CALL
    await next();
  }
}
