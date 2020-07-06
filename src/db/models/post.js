const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate({ User }) {
      this.belongsTo(User, { foreignKey: 'userId', as: 'Author' })
    }

    instanceLevelMethod() {
      return 'instance level method sample'
    }
  }

  Post.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      content: DataTypes.TEXT,
      tags: DataTypes.ARRAY(DataTypes.TEXT),
      userId: {
        type: DataTypes.BIGINT,
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
    { sequelize, modelName: 'Post', tableName: 'posts' }
  )

  return Post
}
