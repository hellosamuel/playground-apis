const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
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

  User.associate = function (models) {
    User.hasMany(models.Post, { foreignKey: 'id' })
  }

  // class method
  User.findByUsername = function (username) {
    return this.findOne({ where: { username } })
  }

  // instance method
  User.prototype.checkPassword = async function (password) {
    const result = await bcrypt.compare(password, this.get('hashedPassword'))
    return result
  }

  User.prototype.serialize = function () {
    const { id, username } = this.get({ plain: true })
    return { id, username }
  }

  User.prototype.generateToken = function () {
    const token = jwt.sign(
      {
        id: this.get('id'),
        username: this.get('username'),
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    )
    return token
  }

  return User
}
