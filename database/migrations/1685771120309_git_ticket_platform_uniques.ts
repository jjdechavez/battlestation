import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'git_ticket_platforms'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.unique(['ticket_id', 'platform_id'])
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropUnique(['ticket_id', 'platform_id'])
    })
  }
}
