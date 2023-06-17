import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import GitProject from './GitProject'
import GitCommit from './GitCommit'

export default class GitTicket extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public projectId: number

  @column()
  public name: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => GitProject)
  public project: BelongsTo<typeof GitProject>

  @hasMany(() => GitCommit, {
    foreignKey: 'ticketId',
  })
  public commits: HasMany<typeof GitCommit>
}
