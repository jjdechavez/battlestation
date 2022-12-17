import BaseSchema from '@ioc:Adonis/Lucid/Schema';
import USER_STATUS from 'App/Constants/UserStatus';

export default class extends BaseSchema {
  protected tableName = 'users';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary();
      table.string('full_name', 180).notNullable();
      table.string('first_name', 180).notNullable();
      table.string('last_name', 180).notNullable();
      table.string('email', 255).notNullable().unique();
      table.string('password', 180).notNullable();
      table.string('remember_me_token').nullable();
      table.string('role').references('alias').inTable('roles').notNullable();
      table
        .enum('status', Object.values(USER_STATUS))
        .defaultTo(USER_STATUS.ACTIVE);
      table.string('avatar_url').nullable();
      table.string('verification_code').nullable();
      table.boolean('is_verified').defaultTo(false);

      /**
       * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true }).notNullable();
      table.timestamp('updated_at', { useTz: true }).notNullable();
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
