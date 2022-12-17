import BaseSchema from '@ioc:Adonis/Lucid/Schema';
import ROLE_STATUS from 'App/Constants/RoleStatus';

export default class extends BaseSchema {
  protected tableName = 'roles';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('alias').primary().unique().notNullable();
      table.string('name').notNullable();
      table
        .enum('status', Object.values(ROLE_STATUS))
        .defaultTo(ROLE_STATUS.ACTIVE);

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
