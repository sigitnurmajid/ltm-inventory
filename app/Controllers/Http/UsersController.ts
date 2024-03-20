import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UsersController {
  public async login({ request, response, auth, session }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')
    const rememberMe = request.input('rememberMe') ? true : false

    try {
      await auth.use('web').attempt(email, password, rememberMe)
      return response.redirect('/')
    } catch (error) {
      session.flash('error', error.message)
      return response.redirect().back()
    }
  }

  public async logout({ auth, response }: HttpContextContract) {
    await auth.use('web').logout()
    response.redirect('/login')
  }
}
