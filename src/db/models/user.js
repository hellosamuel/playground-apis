import bcrypt from 'bcrypt'

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
      },
      hashedPassword: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: 'users',
      setterMethods: {
        password(password) {
          const hashedPassword = bcrypt.hashSync(password, 10)
          this.set('hashedPassword', hashedPassword)
        },
      },
    }
  )

  user.associate = function (models) {
    // associations can be defined here
  }

  // class method
  user.findByUsername = function (username) {
    return this.findOne({ where: { username } })
  }

  // instance method
  user.prototype.checkPassword = async function (password) {
    const result = await bcrypt.compare(password, this.get('hashedPassword'))
    return result
  }

  user.prototype.serialize = function () {
    const data = this.get({ plain: true })
    delete data.hashedPassword
    return data
  }

  return user
}
