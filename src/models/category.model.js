const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  const Category = sequelize.define('Category', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Categories',
        key: 'id'
      }
    }
  })

  Category.associate = (models) => {
    Category.hasMany(models.Category, { as: 'subcategories', foreignKey: 'parentId' })
    Category.belongsTo(models.Category, { as: 'parent', foreignKey: 'parentId' })
  }

  return Category
}