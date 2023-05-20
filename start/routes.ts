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
import User from 'App/Models/User';

Route.get('/', async ({ view }) => {
  return view.render('welcome');
});

Route.get('/register', 'AuthController.viewRegister').as('view.register');
Route.get('/login', 'AuthController.viewLogin').as('view.login');

Route.group(() => {
  Route.post('/register', 'AuthController.register').as('register');
  Route.post('/login', 'AuthController.login').as('login');
  Route.get('/logout', 'AuthController.logout').as('logout');
})
  .prefix('auth')
  .as('auth');

Route.group(() => {
  Route.get('/', async ({ view, auth }) => {
    const user = await User.find(auth.user?.id);

    if (!user) {
      return view.render('pages/dashboard/index', { user: {} });
    }

    await user.load('role');

    return view.render('pages/dashboard/index', { user: user.toJSON() });
  });

  Route.group(() => {
    Route.get('/', 'UsersController.manage').as('manage');
    Route.get('/create', 'UsersController.create').as('create');
    Route.post('/create', 'UsersController.store').as('store');
    Route.get('/:id', 'UsersController.view').as('view');
    Route.get('/:id/edit', 'UsersController.edit').as('edit');
    Route.patch('/:id', 'UsersController.update').as('update');
    Route.patch('/:id/role', 'UsersController.role').as('role');
    Route.delete('/:id', 'UsersController.destroy').as('destroy');
  })
    .prefix('users')
    .as('users');

  Route.group(() => {
    Route.get('/', 'WorkspacesController.index').as('manage');
    Route.get('/create', 'WorkspacesController.create').as('create');
    Route.post('/create', 'WorkspacesController.store').as('store');
    Route.get('/:id', 'WorkspacesController.show').as('view');
    Route.post('/:id/drag', 'WorkspacesController.drag').as('drag');

    Route.post('/:id/sections', 'WorkspaceSectionsController.store').as(
      'sections.store'
    );

    Route.post('/:id/tasks', 'WorkspaceTasksController.store').as(
      'tasks.store'
    );
    Route.get('/:id/tasks/:taskId', 'WorkspaceTasksController.show').as(
      'tasks.show'
    );
    Route.get('/:id/tasks/:taskId/detail', 'WorkspaceTasksController.detail').as(
      'tasks.detail'
    );
    Route.get('/:id/tasks/:taskId/edit', 'WorkspaceTasksController.edit').as(
      'tasks.edit'
    );
    Route.patch('/:id/tasks/:taskId', 'WorkspaceTasksController.update').as(
      'tasks.update'
    );
    Route.delete('/:id/tasks/:taskId', 'WorkspaceTasksController.destroy').as(
      'tasks.destroy'
    );
    Route.post(
      '/:id/sections/:sectionId/position',
      'WorkspaceTasksController.position'
    ).as('tasks.position');
    Route.post(
      '/:id/sections/:sectionId/drag',
      'WorkspaceTasksController.drag'
    ).as('tasks.drag');
  })
    .prefix('workspaces')
    .as('workspaces');

  Route.group(() => {
    Route.get('/', 'GitProjectsController.index').as('manage');
    Route.get('/create', 'GitProjectsController.create').as('create');
    Route.post('/', 'GitProjectsController.store').as('store');
    Route.get('/:id', 'GitProjectsController.show').as('show');
    Route.patch('/:id', 'GitProjectsController.update').as('update');
    Route.delete('/:id', 'GitProjectsController.destroy').as('destroy');
  }).prefix('git-projects').as('git-projects');
})
  .prefix('dashboard')
  .middleware('auth');
