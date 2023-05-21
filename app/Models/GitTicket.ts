import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import GitProject from './GitProject'
import GitPlatform from './GitPlatform'

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

  @manyToMany(() => GitPlatform, {
    pivotTable: 'git_ticket_platforms',
    pivotColumns: ['completedAt']
  })
  public platforms: ManyToMany<typeof GitPlatform>
}
