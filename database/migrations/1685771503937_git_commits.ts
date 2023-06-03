import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'git_commits'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('project_id')
        .unsigned()
        .references('id')
        .inTable('git_projects')
        .onDelete('CASCADE')
      table.string('hashed', 6).notNullable()
      table.string('title').notNullable()
      table.timestamp('commited_at', { useTz: true }).notNullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
