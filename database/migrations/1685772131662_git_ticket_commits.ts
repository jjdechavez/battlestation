import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'git_ticket_commits'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('ticket_id').unsigned().references('git_tickets.id')
      table.integer('commit_id').unsigned().references('git_commits.id')
      table.unique(['ticket_id', 'commit_id'])

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
