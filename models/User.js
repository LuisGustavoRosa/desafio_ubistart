const { Model, DataTypes, Sequelize } = require('sequelize')

class User extends Model {
  static init(sequelize) {
    super.init({
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      user_type:DataTypes.ENUM('admin','user')
    }, {
      sequelize
    })
  }
}

module.exports = User
