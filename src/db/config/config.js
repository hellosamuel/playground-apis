import Config from '../../config'

module.exports = {
  development: Config.db,
  test: Config.db,
  production: Config.db,
}
