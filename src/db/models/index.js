import fs from 'fs'
import path from 'path'
import Sequelize from 'sequelize'

import Config from '../../config'
import logger from '../../logger'

const basename = path.basename(__filename)
const config = Config.db
const db = {}

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

// For using migration via sequelize-cli
// There is also way to load models dynamically
// EX) const models = [ import('./user'), ...]
const modelsDir =
  process.env.NODE_ENV === 'development' ? __dirname : `${__dirname}/db/models`

console.log(modelsDir)

fs.readdirSync(modelsDir)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    )
  })
  .forEach(file => {
    const model = sequelize.import(path.join(modelsDir, file))
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
