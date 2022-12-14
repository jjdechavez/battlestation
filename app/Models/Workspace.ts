import { DateTime } from 'luxon';
import {
  BaseModel,
  BelongsTo,
  belongsTo,
  column,
  HasMany,
  hasMany,
} from '@ioc:Adonis/Lucid/Orm';
import { WorkspaceStatus, WorkspaceType } from 'App/Constants/Workspace';
import User from './User';
import WorkspaceSection from './WorkspaceSection';

export default class Workspace extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public authorId: number;

  @column()
  public title: string;

  @column()
  public summary?: string;

  @column()
  public type: WorkspaceType;

  @column()
  public status: WorkspaceStatus;

  @belongsTo(() => User)
  public author: BelongsTo<typeof User>;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @hasMany(() => WorkspaceSection)
  public sections: HasMany<typeof WorkspaceSection>;
}
