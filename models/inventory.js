'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Inventory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Inventory.belongsTo(models.Store, { foreignKey: 'store_id', as: 'store' });
      Inventory.belongsTo(models.Employee, { foreignKey: 'employee_id', as: 'employee' });
    }
  }
  Inventory.init({
    id: {
      field: 'id',
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      unique: true,
      autoIncrement: true
    },
    store_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    employee_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    flavor: {
      type: DataTypes.STRING,
      allowNull: false
    },
    is_season_flavor: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Inventory',
  });
  sequelize.sync()
    .then(() => {
      console.log('Database and tables synced.');
      // Start your Node.js application or perform other operations here
    })
    .catch((error) => {
      console.error('Error syncing database:', error);
    });
  return Inventory;
};