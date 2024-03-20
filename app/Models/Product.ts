import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Category from './Category'
import Location from './Location'
import Unit from './Unit'
import Transaction from './Transaction'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public onHand: number

  @column()
  public picture: string

  @column()
  public categoryId: number

  @column()
  public locationId: number

  @column()
  public unitId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Category)
  public category: BelongsTo<typeof Category>

  @belongsTo(() => Location)
  public location: BelongsTo<typeof Location>

  @belongsTo(() => Unit)
  public unit: BelongsTo<typeof Unit>

  @hasMany(() => Transaction)
  public products: HasMany<typeof Transaction>
}
