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

        if (await bcrypt.compare(req.body.password, user.password)) {

          const token = jwt.sign({
            id: user.id,
            email: user.email,
            tipo_user: user.tipo_user
          },
            process.env.SECRET, {
            expiresIn: 3000 
          });
          res.json({ auth: true, token: token });
          res.send({ token })
        } else {
          res.send('Não permitido')
        }
      } catch {
        res.status(500).send();
      }
    }
  },

  async createUser(req, res) {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      const { name, email, tipo_user } = req.body
      if (!name) {
        return res.status(422).json({ msg: 'Nome é obrigatório' })
      }
      if (!email) {
        return res.status(422).json({ msg: 'Email é obrigatório' })
      }
      if (!hashedPassword) {
        return res.status(422).json({ msg: 'Senha é obrigatório' })
      }
      if (!tipo_user) {
        return res.status(422).json({ msg: 'Tipo do usuário é obrigatório' })
      }
      const user = await User.findOne({ where: { email } })
      if (user) {
        res.status(401).json({ message: "Já existe um usuario com este email" })
      } else {
        const user = await User.create({ name, email, password: hashedPassword, tipo_user })
        res.status(200).json({ user })
      }
    } catch (error) {
      res.status(400).json({ error })
    }
  },

  async updateUser(req, res) {
    try {
      const { id } = req.params
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
          tipo_user: 'user'
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
    const { id } = req.params
    const user = await User.findOne({ where: { id } })
    if (!user) {
      res.status(401).json({ message: 'Usuario não encontrado' })
    } else {
      await User.destroy({ where: { id } })
      res.status(200).json({ ok: true })
    }
  }
}
