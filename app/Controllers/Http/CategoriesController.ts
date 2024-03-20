import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Category from 'App/Models/Category'

export default class CategoriesController {
  public async index({ view }: HttpContextContract) {
    const categories = await Database.from('categories').select().orderBy('updated_at', 'desc')

    return await view.render('pages/category/index', { categories })
  }

  public async create({ view }: HttpContextContract) {
    return await view.render('pages/category/create')
  }
  public async store({ request, session, response }: HttpContextContract) {
    const name = request.input('name')

    const category = new Category()
    category.name = name

    try {
      await category.save()
      session.flash('error', 'false')
    } catch (error) {
      session.flash('error', 'true')
    }
    session.flash('method', 'Add')
    return response.redirect().toRoute('master.category.index')
  }

  public async show({ request, view }: HttpContextContract) {
    const id = request.param('id')

    const category = await Category.findOrFail(id)
    await category.load('products')

    return await view.render('pages/category/detail', { category })
  }

  public async edit({ view, request }: HttpContextContract) {
    const id = request.param('id')

    const category = await Category.findOrFail(id)

    return await view.render('pages/category/edit', { category })
  }

  public async update({ request, session, response }: HttpContextContract) {
    const id = request.param('id')
    const name = request.input('name')
    try {
      const category = await Category.findOrFail(id)
      category.name = name

      await category.save()
      session.flash('error', 'false')
    } catch (error) {
      session.flash('error', 'true')
    }
    session.flash('method', 'Edit')
    return response.redirect().back()
  }

  public async destroy({ request, response }: HttpContextContract) {
    const id = request.param('id')

    const category = await Category.findOrFail(id)
    await category.delete()
    return response.redirect().toRoute('master.category.index')
  }
}
