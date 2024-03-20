import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Location from 'App/Models/Location'
import Application from '@ioc:Adonis/Core/Application'

export default class LocationsController {
  public async index({ view }: HttpContextContract) {
    const locations = await Location.query().orderBy('updated_at')

    return await view.render('pages/location/index', { locations })
  }

  public async create({ view }: HttpContextContract) {
    return await view.render('pages/location/create')
  }

  public async store({ request, session, response }: HttpContextContract) {
    const name = request.input('name')
    const picture = request.file('picture')

    if (picture) {
      const fileName = `${name}-${Date.now()}.jpeg`
      await picture.move(Application.tmpPath('uploads'), {
        name: fileName,
      })
    }

    const location = new Location()
    location.name = name
    location.picture = picture?.fileName || 'null'

    try {
      await location.save()
      session.flash('error', 'false')
    } catch (error) {
      session.flash('error', 'true')
    }
    session.flash('method', 'Add')
    return response.redirect().toRoute('master.location.index')
  }

  public async show({ request, view }: HttpContextContract) {
    const id = request.param('id')

    const location = await Location.findOrFail(id)
    await location.load('products')

    return await view.render('pages/location/detail', { location })
  }

  public async edit({}: HttpContextContract) {}

  public async update({ request, response }: HttpContextContract) {
    const id = request.param('id')
    const name = request.input('name')
    const picture = request.file('picture')

    const location = await Location.findOrFail(id)
    location.name = name

    if (picture) {
      const fileName = `${name}-${Date.now()}.jpeg`
      await picture.move(Application.tmpPath('uploads'), {
        name: fileName,
      })
      location.picture = picture?.fileName || 'null'
    }

    await location.save()

    return response.redirect().back()
  }

  public async destroy({ request, response }: HttpContextContract) {
    const id = request.param('id')

    const location = await Location.findOrFail(id)
    await location.delete()
    return response.redirect().toRoute('master.location.index')
  }
}
