import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { encrypt } from '../lib/cryptoHelper'

export default (sequelize, DataTypes) => {
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
    const payload = {
      id: this.get('id'),
      username: this.get('username'),
    }

    const token = jwt.sign(
      { payload: encrypt(JSON.stringify(payload)) },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    )
    return token
  }

  return User
}
