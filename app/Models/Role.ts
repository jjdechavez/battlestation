import { DateTime } from 'luxon';
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm';
import { RoleStatus } from 'App/Constants/RoleStatus';

export default class Role extends BaseModel {
  @column({ isPrimary: true })
  public alias: string;

  @column()
  public name: string;

  @column()
  public status: RoleStatus;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
