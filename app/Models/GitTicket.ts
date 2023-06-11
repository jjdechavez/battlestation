import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import GitProject from './GitProject'
import GitPlatform from './GitPlatform'
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

  @manyToMany(() => GitPlatform, {
    pivotTable: 'git_ticket_platforms',
    pivotColumns: ['completedAt'],
    pivotForeignKey: 'ticket_id',
    pivotRelatedForeignKey: 'platform_id',
    pivotTimestamps: true,
  })
  public platforms: ManyToMany<typeof GitPlatform>

  @manyToMany(() => GitCommit, {
    pivotTable: 'git_ticket_commits',
    pivotForeignKey: 'ticket_id',
    pivotRelatedForeignKey: 'commit_id',
    pivotTimestamps: true,
  })
  public commits: ManyToMany<typeof GitCommit>
}
