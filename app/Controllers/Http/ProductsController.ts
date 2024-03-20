import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Category from 'App/Models/Category'
import Location from 'App/Models/Location'
import Product from 'App/Models/Product'
import Application from '@ioc:Adonis/Core/Application'
import Unit from 'App/Models/Unit'

export default class ProductsController {
  public async index({ view }: HttpContextContract) {
    const products = await Product.query()
      .orderBy('updated_at', 'desc')
      .preload('category')
      .preload('location')
      .preload('unit')

    return await view.render('pages/product/index', { products })
  }

  public async create({ view }: HttpContextContract) {
    const categories = await Category.query()
    const locations = await Location.query()
    const units = await Unit.query()

    return await view.render('pages/product/create', { categories, locations, units })
  }

  public async store({ request, session, response }: HttpContextContract) {
    const name = request.input('name')
    const onHand = request.input('onHand')
    const categoryId = request.input('category')
    const locationId = request.input('location')
    const unitId = request.input('unit')
    const picture = request.file('picture')

    if (picture) {
      const fileName = `product-${name}-${Date.now()}.jpeg`
      await picture.move(Application.tmpPath('uploads'), {
        name: fileName,
      })
    }

    const product = new Product()
    product.name = name
    product.onHand = parseInt(onHand)
    product.picture = picture?.fileName || 'null'

    const trx = await Database.transaction()

    try {
      product.useTransaction(trx)
      await product.save()

      if (categoryId) {
        const category = await Category.findOrFail(categoryId)
        category.useTransaction(trx)
        await product.related('category').associate(category)
      }

      if (locationId) {
        const location = await Location.findOrFail(locationId)
        location.useTransaction(trx)
        await product.related('location').associate(location)
      }

      if (unitId) {
        const unit = await Unit.findOrFail(unitId)
        unit.useTransaction(trx)
        await product.related('unit').associate(unit)
      }

      await trx.commit()

      session.flash('error', 'false')
    } catch (error) {
      await trx.rollback()
      session.flash('error', 'true')
    }
    session.flash('method', 'Add')
    return response.redirect().toRoute('master.product.index')
  }

  public async show({ request, view }: HttpContextContract) {
    const id = request.param('id')

    const product = await Product.findOrFail(id)
    await product.load('category')
    await product.load('location')
    await product.load('unit')

    const categories = await Category.query()
    const locations = await Location.query()
    const units = await Unit.query()

    return await view.render('pages/product/detail', { product, categories, locations, units })
  }

  public async edit({ }: HttpContextContract) { }

  public async update({ request, response }: HttpContextContract) {
    const id = request.param('id')
    const name = request.input('name')
    const onHand = request.input('onHand')
    const categoryId = request.input('category')
    const locationId = request.input('location')
    const unitId = request.input('unit')
    const picture = request.file('picture')

    const product = await Product.findOrFail(id)

    if (picture) {
      const fileName = `product-${name}-${Date.now()}.jpeg`
      await picture.move(Application.tmpPath('uploads'), {
        name: fileName,
      })
      product.picture = picture?.fileName || 'null' 
    }


    product.name = name
    product.onHand = onHand
    const trx = await Database.transaction()

    try {
      product.useTransaction(trx)
      await product.save()

      if (categoryId) {
        const category = await Category.findOrFail(categoryId)
        category.useTransaction(trx)
        await product.related('category').associate(category)
      }

      if (locationId) {
        const location = await Location.findOrFail(locationId)
        location.useTransaction(trx)
        await product.related('location').associate(location)
      }

      if (unitId) {
        const unit = await Unit.findOrFail(unitId)
        unit.useTransaction(trx)
        await product.related('unit').associate(unit)
      }

      await trx.commit()
    } catch (error) {
      await trx.rollback()
      console.error(error)
    }
    return response.redirect().back()

  }

  public async destroy({ request, response }: HttpContextContract) {
    const id = request.param('id')

    const product = await Product.findOrFail(id)
    await product.delete()
    return response.redirect().toRoute('master.product.index')
  }
}
