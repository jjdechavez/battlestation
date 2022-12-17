import { DateTime } from 'luxon';
import Hash from '@ioc:Adonis/Core/Hash';
import {
  column,
  beforeSave,
  BaseModel,
  belongsTo,
  BelongsTo,
} from '@ioc:Adonis/Lucid/Orm';
import { UserStatus } from 'App/Constants/UserStatus';
import Role from './Role';

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public fullName: string;

  @column()
  public firstName: string;

  @column()
  public lastName: string;

  @column()
  public avatarUrl: string | null;

  @column()
  public status: UserStatus;

  @column()
  public roleAlias: string;

  @column()
  public email: string;

  @column({ serializeAs: null })
  public password: string;

  @column()
  public rememberMeToken: string | null;

  @column()
  public isVerified: boolean;

  @column()
  public verificationCode: string | null;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @belongsTo(() => Role, {
    foreignKey: 'roleAlias',
  })
  public role: BelongsTo<typeof Role>;

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password);
    }
  }
}
