/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/login', ({ view }) => {
  return view.render('login')
})

Route.get('/', async ({ view }) => {
  return await view.render('pages/dashboard')
})
  .middleware('auth')
  .as('dashboard')

Route.group(() => {
  Route.get('logout', 'UsersController.logout').middleware('auth').as('logout')
  Route.post('login', 'UsersController.login').as('login')
})
  .prefix('user')
  .as('user')

Route.group(() => {
  Route.resource('category', 'CategoriesController').middleware({
    '*': ['auth'],
  })
  Route.resource('location', 'LocationsController').middleware({
    '*': ['auth'],
  })
  Route.resource('product', 'ProductsController').middleware({
    '*': ['auth'],
  })
  Route.resource('unit', 'UnitsController').middleware({
    '*': ['auth'],
  })

})
  .prefix('master')
  .as('master')

Route.group(() => {
  Route.resource('transaction', 'TransactionsController').middleware({
    '*': ['auth'],
  })
})
  .prefix('utilities')
  .as('utilities')
