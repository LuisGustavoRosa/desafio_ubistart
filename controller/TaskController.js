
const Task = require('../models/Task')
const User = require('../models/User')
const { Op } = require('sequelize')
const jwt =  require('jsonwebtoken');
module.exports = {
  async createTask(req, res) {

      const  userId = req.user.id
      const { description, done, deadline } = req.body
      if (!description) {
        return res.status(400).json({ msg: 'Descrição é obrigatória' })
      }
      if (!deadline) {
        return res.status(400).json({ msg: 'Prazo é obrigatório' })
      }
      const task = await Task.create({ description, deadline ,done, user_id : userId  })
      res.status(200).json({ task })
   
  },

  async updateTask(req, res) {
    try {
      const  id = req.params.id
      console.log(id)
      const userId = req.user.id
      console.log(userId)
      
      const { description, deadline } = req.body
      const task = await Task.findOne({ 
        where: {
          id : id,
          user_id : userId
        },
      })
      console.log(task)
      if (!task) {
        res.status(401).json({ message: "Nenhuma tarefa encontrada" })
      } else {
        const task = await Task.update({ description, deadline}, {    
          where: {
            id : id,
            user_id : userId
          },
         })
        res.status(200).json({ msg:'Tarefa alterada com sucesso' } , task)
      }
    } catch (error) {
      res.status(400).json({ error })
    }
  },

  // listas todas as taks com o seus usuários
  async listTasks(req, res) {
    console.log(req.user)
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
    const  id = req.user.id
    console.log(id)
    try {
      const tasks = await Task.findAll({
        where: {
          user_id: id
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
    try {
      const  id = req.params.id
      const userId = req.user.id
      const task = await Task.findOne({ 
        where: {
          id : id,
          user_id : userId
        },
      })
      console.log(task)
      if (!task) {
        res.status(401).json({ message: "Nenhuma tarefa encontrada" })
      } else {
        const task = await Task.destroy({  
          where: {
            id : id,
            user_id : userId
          },
       })
        res.status(200).json({ msg:'Tarefa excluida com sucesso' })
      }
    } catch (error) {
      res.status(400).json({ error })
    }
  },

  //coclocando a tarefa como concluida recebendo o id por parametro
  async doneTask(req, res) {
    try {
      const  id = req.params.id
      const userId = req.user.id
      const task = await Task.findOne({ 
        where: {
          id : id,
          user_id : userId
        },
      })
      if (!task) {
        res.status(401).json({ message: "Nenhuma tarefa encontrada" })
      } else {
        const data = new Date()
        
        const task = await Task.update({ done: 'true', finished : data.toLocaleString()}, { 
          where: {
            id : id,
            user_id : userId
          }, 
        })
        res.status(200).json('tarefa concluida' , task)
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
          user_type: "user"
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