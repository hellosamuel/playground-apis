module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define(
    'users',
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      password: {
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
      setterMethods: {
        password(pw) {
          const changedPw = `${pw}+1234helloWorld`
          this.setDataValue('password', changedPw)
        },
      },
    }
  )
  user.associate = function(models) {
    // associations can be defined here
  }
  return user
}
