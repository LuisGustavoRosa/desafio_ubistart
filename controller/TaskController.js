
const Task = require('../models/Task')
const User = require('../models/User')
const { Op } = require('sequelize')
module.exports = {
  async createTask(req, res) {
    try {
     
      const { description, done, deadline, user_id } = req.body
      if (!description) {
        return res.status(422).json({ msg: 'Descrição é obrigatório' })
      }
      if (!deadline) {
        return res.status(422).json({ msg: 'Prazo é obrigatório' })
      }
  
      if (!user_id) {
        return res.status(422).json({ msg: 'Id do usuário é obrigatório' })
      }
      const task = await Task.create({ description, deadline ,done,  user_id })
      res.status(200).json({ task })
    } catch (error) {
      res.status(400).json({ error })
    }
  },


  async updateTask(req, res) {
    try {
      const { id } = req.params
      const { description, deadline } = req.body
      const task = await Task.findOne({ where: { id } })
      if (!task) {
        res.status(401).json({ message: "Nenhuma tarefa encontrada" })
      } else {
        const task = await Task.update({ description, deadline}, { where: { id } })
        res.status(200).json({ msg:'Tarefa alterada com sucesso' })
      }
    } catch (error) {
      res.status(400).json({ error })
    }
  },

  // listas todas as taks com o seus usuários
  async listTasks(req, res) {
    try {
      const tasks = await Task.findAll({   
      attributes: ['deadline','done'],
      include: [
        {
          model: User,
          attributes: ['email']
        }
      ],
     
      });
      if (!tasks) {
        res.status(401).json({ message: 'Não existem tarefas cadastradas' })
      }
      res.status(200).json({ tasks })
    } catch (error) {
      res.status(400).json({ error })
    }
  },

  // Listar tarefas de um determinado usuário recebendo seu id por parametro
  async listTask(req, res) {
    try {
      const tasks = await Task.findAll({
        where: {
          user_id: req.params.id
        }
      });
      if (!tasks) {
        res.status(401).json({ message: 'Não existem tarefas cadastradas' })
      }
      res.status(200).json({ tasks })
    } catch (error) {
      res.status(400).json({ error })
    }
  },

  // deletar uma task recebendo o id por parametro
  async deleteTask(req, res) {
    const { id } = req.params
    const task = await Task.findOne({ where: { id } })
    if (!task) {
      res.status(401).json({ message: 'Tarefa não encontrada' })
    } else {
      await Task.destroy({ where: { id } })
      res.status(200).json({ ok: true })
    }
  },

  //coclocando a tarefa como concluida recebendo o id por parametro
  async doneTask(req, res) {
    try {
      const { id } = req.params
      const task = await Task.findOne({ where: { id } })
      if (!task) {
        res.status(401).json({ message: "Nenhuma tarefa encontrada" })
      } else {
        const data = new Date()
        
        const task = await Task.update({ done: 'true', finished : data.toLocaleString()}, { where: { id } })
        res.status(200).json('tarefa concluida')
      }
    } catch (error) {
      res.status(400).json({ error })
    }
  },

// lista todas as tarefas com atraso
  async lateTask(req, res) {
    const data = new Date()
    const data_  = formatarData(data)
    console.log(data_)
      const user = await User.findAll({
        attributes: ['email'],
        include: [
          {
            model: Task,
            attributes: ['deadline', 'done'],
            where: {
              deadline: {
                [Op.lt]:data_
              }
            }
        }
        ],
        where:{
          tipo_user : 2
        }
      });
      
      if (!user) {
        res.status(401).json({ message: "Nenhuma tarefa encontrada" })
      } else {
        res.status(200).json({ user })
      }
    

  },
}
const formatarData =  (data_) => {
  let data= new Date(data_);
  // Month retorna entre 0 e 11, por isso a adição +1
  return `${data.getDate()}/${data.getMonth()+1}/${data.getFullYear()}`
}