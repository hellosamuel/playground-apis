import Sequelize from 'sequelize'

import Config from '../config'
import logger from '../logger'

const config = Config.db
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    ...config,
    logging: message => logger.info(message),
  }
)

sequelize
  .authenticate()
  .then(() => console.log('Connection has been established successfully.'))

// For loading models dynamically especially in webpack
// eslint-disable-next-line global-require
const modules = [require('./user'), require('./post')]

const db = {}
modules.forEach(module => {
  const model = module.default(sequelize, Sequelize.DataTypes)
  db[model.name] = model
})

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

export default db
