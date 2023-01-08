import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Workspace from './Workspace';
import WorkspaceTask from './WorkspaceTask';

export default class WorkspaceSection extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public workspaceId: number;

  @column()
  public title: string;

  @column()
  public position: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Workspace)
  public workspace: BelongsTo<typeof Workspace>

  @hasMany(() => WorkspaceTask, {
    foreignKey: 'sectionId'
  })
  public tasks: HasMany<typeof WorkspaceTask>
}
