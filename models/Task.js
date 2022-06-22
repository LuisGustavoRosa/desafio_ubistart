
const { Model, DataTypes } = require('sequelize')
const User = require('../models/User')

class Task extends Model {
  static init(sequelize) {
    super.init({
      description: DataTypes.STRING,
      deadline: DataTypes.STRING,
      done:DataTypes.STRING,
      finished:DataTypes.STRING,
      user_id:DataTypes.STRING
      
    }, {
      sequelize
    })
    Task.belongsTo(User,{
      constraint:true,
      foreignKey:'user_id'
    })

    User.hasMany(Task,{
      foreingKey: 'user_id'
    })
  }
 

}
module.exports = Task
