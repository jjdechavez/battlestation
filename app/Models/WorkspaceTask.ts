import { DateTime } from 'luxon';
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm';
import { slugify } from '@ioc:Adonis/Addons/LucidSlugify';
import { WorkspaceTaskPriority } from 'App/Constants/Workspace';
import WorkspaceSection from './WorkspaceSection';

export default class WorkspaceTask extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public sectionId: number;

  @column()
  public title: string;

  @column()
  @slugify({
    strategy: 'dbIncrement',
    fields: ['title']
  })
  public slug: string;

  @column()
  public content: string | null;

  @column()
  public position: number;

  @column()
  public priority: WorkspaceTaskPriority | null;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @belongsTo(() => WorkspaceSection)
  public section: BelongsTo<typeof WorkspaceSection>
}
