import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class extends BaseSeeder {
  public async run() {
    await User.createMany([
      {
        name: 'Sigit',
        email: 'sigit@gmail.com',
        password: 'sigit',
      },
      {
        name: 'Admin',
        email: 'admin@gmail.com',
        password: 'admin',
      },
    ])
  }
}
