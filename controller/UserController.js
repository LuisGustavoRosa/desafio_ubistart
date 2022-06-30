const Task = require('../models/Task')
const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
module.exports = {
  async login(req, res) {

    const user = await User.findOne({
      where: {
        email: req.body.email,
      }
    });
    if (!user) {
      return res.status(400).send('Não foi possivel localizar o usuário')
    } else {
      try {
        if(req.body.email == 'Admin'){
          const token = jwt.sign({
            id: user.id,
            email: user.email,
            user_type: user.user_type
          },
            process.env.SECRET, {
            expiresIn: 300  
          });
          res.json({ token: token });
        }
        if (await bcrypt.compare(req.body.password, user.password)) {
          const token = jwt.sign({
            id: user.id,
            email: user.email,
            user_type: user.user_type
          },
            process.env.SECRET, {
            expiresIn: 3000000  
          });
          res.json({ token: token });
          
        } else {
          res.send('Não permitido')
        }
      } catch {
        res.status(401).send();
      }
    }
  },

  async createUser(req, res) {
    
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      const { name, email, user_type } = req.body
      console.log(req.body)
      if (!name) {
        return res.status(400).json({ msg: 'Nome é obrigatório' })
      }
      if (!email) {
        return res.status(400).json({ msg: 'Email é obrigatório' })
      }
      if (!hashedPassword) {
        return res.status(400).json({ msg: 'Senha é obrigatório' })
      }
      if (!user_type) {
        return res.status(400).json({ msg: 'Tipo do usuário é obrigatório' })
      }
      const user = await User.findOne({ where: { email } })
      if (user) {
        res.status(422).json({ message: "Já existe um usuario com este email" })
      } else {
        const user = await User.create({ name, email, password: hashedPassword, user_type })
        res.status(201).json({ user })
      }
  
  },

  async updateUser(req, res) {
    try {

      const  id = req.params.id
      const { name, email, tipo_user } = req.body
      const user = await User.findOne({ where: { id } })
      if (!user) {
        res.status(401).json({ message: "Nenhum usuario encontrado" })
      } else {
        const user = await User.update({ name, email, password, tipo_user }, { where: { id } })
        res.status(200).json({ user })
      }
    } catch (error) {
      res.status(400).json({ error })
    }
  },
  async listUsers(req, res) {
    try {
      const user = await User.findAll({
        attributes: ['email'],
        include: [
          {
            model: Task,
            attributes: ['deadline', 'done']
          }
        ],
        where: {
          user_type: 'user'
        }
      }
      );

      if (!user) {
        res.status(401).json({ message: "Nenhum usuário encontrada" })
      } else {
        res.status(200).json({ user })
      }
    } catch (error) {
      res.status(400).json({ error })
    }


  },
  async listUser(req, res) {

    try {
      const users = await User.findByPk(req.params.id, { include: Task })
      if (!users) {
        res.status(401).json({ message: 'Não existe um usuário cadastrado ' })
      }
      res.status(200).json({ users })
    } catch (error) {
      res.status(400).json({ error })
    }
  },
  async deleteUser(req, res) {
    const  id = req.params.id
    const user = await User.findOne({ where: { id } })
    if (!user) {
      res.status(401).json({ message: 'Usuario não encontrado' })
    } else {
      await User.destroy({ where: { id } })
      res.status(200).json({ ok: true })
    }
  }
}
