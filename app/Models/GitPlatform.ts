import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import GitProject from './GitProject'
import GitTicket from './GitTicket'

export default class GitPlatform extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public projectId: number

  @column()
  public alias: string

  @column()
  public name: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => GitProject)
  public project: BelongsTo<typeof GitProject>

  @manyToMany(() => GitTicket, {
    pivotTable: 'git_ticket_platforms',
    pivotColumns: ['completedAt'],
    pivotForeignKey: 'platform_id',
    pivotRelatedForeignKey: 'ticket_id',
  })
  public tickets: ManyToMany<typeof GitTicket>
}
