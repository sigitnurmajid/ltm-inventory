import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 30).notNullable()
      table.integer('on_hand')
      table.string('picture', 255)
      table.integer('category_id').references('categories.id').nullable().onDelete('SET NULL')
      table.integer('location_id').references('locations.id').nullable().onDelete('SET NULL')
      table.integer('unit_id').references('units.id').nullable().onDelete('SET NULL')
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
