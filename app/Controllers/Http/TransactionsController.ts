import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Product from 'App/Models/Product'
import Transaction from 'App/Models/Transaction'

export default class TransactionsController {
  public async index({ view }: HttpContextContract) {
    const products = await Product.query()
    return await view.render('pages/transaction/create', { products })
  }

  public async create({ }: HttpContextContract) { }

  public async store({ request, response, session }: HttpContextContract) {
    const body = request.body()
    const qty = parseInt(body.qty)

    try {
      const product = await Product.findOrFail(body.product)
      const transaction = new Transaction

      let qtyProductAfter : number = 0

      if (body.type === 'IN') {
        qtyProductAfter = product.onHand + qty
      } else if (body.type === 'OUT') {
        qtyProductAfter = product.onHand - qty
      } else {
        qtyProductAfter = product.onHand
      }

      if (qtyProductAfter < 0) {
        throw new Error('Result qty less than 0')
      }

      transaction.type = body.type
      transaction.qty = qty
      transaction.qty_product_before = product.onHand
      transaction.qty_product_after = qtyProductAfter
      transaction.note = body.note
      await transaction.related('product').associate(product)

      await transaction.save()

      product.onHand = qtyProductAfter
      await product.save()

      session.flash('error', 'false')
    } catch (error) {
      session.flash('error', 'true')
      session.flash('message', error.message)
    }
    session.flash('method', 'Add')

    return response.redirect().back()
  }

  public async show({ }: HttpContextContract) { }

  public async edit({ }: HttpContextContract) { }

  public async update({ }: HttpContextContract) { }

  public async destroy({ }: HttpContextContract) { }
}
