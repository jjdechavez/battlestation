import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'git_ticket_commits'

  public async up () {
    this.schema.dropTableIfExists('git_ticket_platforms')
    this.schema.dropTableIfExists('git_ticket_commits')
    this.schema.alterTable('git_commits', (table) => {
      table.integer('platform_id').unsigned().references('git_platforms.id')
      table.timestamp('completed_at', { useTz: true })
      table.integer('ticket_id')
        .unsigned()
        .notNullable()
        .references('git_tickets.id')
        .onDelete('CASCADE')
    })
  }

  public async down () {
    this.schema.dropTableIfExists('git_tracks')
    this.schema.createTableIfNotExists(this.tableName, (table) => {
      table.integer('ticket_id').unsigned().references('git_tickets.id')
      table.integer('commit_id').unsigned().references('git_commits.id')
      table.unique(['ticket_id', 'commit_id'])

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
    this.schema.alterTable('git_commits', (table) => {
      table.dropColumn('platform_id')
      table.dropColumn('completed_at')
      table.dropColumn('ticket_id')
    })
  }
}
