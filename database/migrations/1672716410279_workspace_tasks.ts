import BaseSchema from '@ioc:Adonis/Lucid/Schema';
import { WORKSPACE_TASK_PRIORITY } from 'App/Constants/Workspace';

export default class extends BaseSchema {
  protected tableName = 'workspace_tasks';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable();
      table
        .integer('section_id')
        .unsigned()
        .notNullable()
        .references('workspace_sections.id');
      table.string('title', 255).notNullable();
      table.string('slug').notNullable().unique();
      table.text('content', 'longtext').nullable();
      table.integer('position').notNullable();
      table.string('priority').defaultTo(WORKSPACE_TASK_PRIORITY.NO_PRIORITY)

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true });
      table.timestamp('updated_at', { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
