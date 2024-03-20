import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import BomLine from './BomLine'
import Product from './Product'

export default class Bom extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public qty: number

  @belongsTo(() => BomLine)
  public bomLine: BelongsTo<typeof BomLine>

  @belongsTo(() => Product)
  public product: BelongsTo<typeof Product>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
