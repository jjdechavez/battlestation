import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import GitProject from './GitProject'
import GitTicket from './GitTicket'

export default class GitCommit extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public projectId: number

  @column()
  public hashed: string

  @column()
  public title: string

  @column.dateTime()
  public commitedAt: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => GitProject)
  public project: BelongsTo<typeof GitProject>

  @manyToMany(() => GitTicket, {
    pivotTable: 'git_ticket_commits',
    pivotForeignKey: 'commit_id',
    pivotRelatedForeignKey: 'ticket_id',
    pivotTimestamps: true,
  })
  public tickets: ManyToMany<typeof GitTicket>
}
