import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column  } from '@ioc:Adonis/Lucid/Orm'
import GitProject from './GitProject'
import GitTicket from './GitTicket'
import GitPlatform from './GitPlatform'

export default class GitCommit extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public projectId: number

  @column()
  public platformId: string

  @column()
  public ticketId: string

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

  @column.dateTime()
  public completedAt?: DateTime

  @belongsTo(() => GitProject)
  public project: BelongsTo<typeof GitProject>

  @belongsTo(() => GitPlatform, {
    foreignKey: 'platformId',
    localKey: 'id',
  })
  public platform: BelongsTo<typeof GitPlatform>

  @belongsTo(() => GitTicket)
  public ticket: BelongsTo<typeof GitTicket>
}
