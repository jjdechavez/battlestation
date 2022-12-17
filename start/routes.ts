/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route';
import Role from 'App/Models/Role';
import User from 'App/Models/User';

Route.get('/', async ({ view }) => {
  const roles = await Role.query().orderBy('name');

  return view.render('welcome', { roles });
});

Route.post('/auth/register', 'AuthController.register').as('auth.register');
Route.post('/auth/login', 'AuthController.login').as('auth.login');
Route.get('/auth/logout', 'AuthController.logout').as('auth.logout');

Route.group(() => {
  Route.get('/', async ({ view, auth }) => {
    const user = await User.find(auth.user?.id);
    await user.load('role');

    return view.render('dashboard/index', { user: user.toJSON() });
  });
}).prefix('dashboard');
