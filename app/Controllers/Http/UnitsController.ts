import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Unit from 'App/Models/Unit'

export default class CategoriesController {
  public async index({ view }: HttpContextContract) {
    const units = await Database.from('units').select().orderBy('updated_at', 'desc')

    return await view.render('pages/unit/index', { units })
  }

  public async create({ view }: HttpContextContract) {
    return await view.render('pages/unit/create')
  }
  public async store({ request, session, response }: HttpContextContract) {
    const name = request.input('name')

    const unit = new Unit()
    unit.name = name

    try {
      await unit.save()
      session.flash('error', 'false')
    } catch (error) {
      session.flash('error', 'true')
    }
    session.flash('method', 'Add')
    return response.redirect().toRoute('master.unit.index')
  }

  public async show({ request, view }: HttpContextContract) {
    const id = request.param('id')

    const unit = await Unit.findOrFail(id)
    await unit.load('products')

    return await view.render('pages/unit/detail', { unit })
  }

  public async edit({ view, request }: HttpContextContract) {
    const id = request.param('id')

    const unit = await Unit.findOrFail(id)

    return await view.render('pages/unit/edit', { unit })
  }

  public async update({ request, session, response }: HttpContextContract) {
    const id = request.param('id')
    const name = request.input('name')
    try {
      const unit = await Unit.findOrFail(id)
      unit.name = name

      await unit.save()
      session.flash('error', 'false')
    } catch (error) {
      session.flash('error', 'true')
    }
    session.flash('method', 'Edit')
    return response.redirect().back()
  }

  public async destroy({ request, response }: HttpContextContract) {
    const id = request.param('id')

    const unit = await Unit.findOrFail(id)
    await unit.delete()
    return response.redirect().toRoute('master.unit.index')
  }
}
