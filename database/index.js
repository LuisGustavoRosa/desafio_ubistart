const Sequelize = require('sequelize');
const configDB = require('../config/database');

const User = require('../models/User')
const Task = require('../models/Task')

const connection = new Sequelize(configDB)

User.init(connection)
Task.init(connection)

module.exports = connection