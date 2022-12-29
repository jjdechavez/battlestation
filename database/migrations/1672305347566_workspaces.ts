import BaseSchema from '@ioc:Adonis/Lucid/Schema';
import { WORKSPACE_STATUS, WORKSPACE_TYPE } from 'App/Constants/Workspace';

export default class extends BaseSchema {
  protected tableName = 'workspaces';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table
        .integer('author_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
      table.string('title', 180).notNullable();
      table.string('summary', 255).nullable();
      table.enum('type', Object.values(WORKSPACE_TYPE));
      table
        .enum('status', Object.values(WORKSPACE_STATUS))
        .defaultTo(WORKSPACE_STATUS.ACTIVE);

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
