'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Employee.hasMany(models.Inventory, { foreignKey: 'employee_id', as: 'employee' });
    }
  }
  Employee.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      unique: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Employee',
  });
  sequelize.sync()
    .then(() => {
      console.log('Database and tables synced.');
      // Start your Node.js application or perform other operations here
    })
    .catch((error) => {
      console.error('Error syncing database:', error);
    });
  return Employee;
};