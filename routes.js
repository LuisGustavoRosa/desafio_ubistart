const { Router } = require('express')

const UserController = require('./controller/UserController')
const TaskController = require('./controller/TaskController')
require("dotenv-safe").config();
const verify = require('./middleware/verifyJwt')
const decode = require('./middleware/decodeJwt');


const router = Router()

/////////////////////////////////////////USUARIO////////////////////////////////
//Rota para criar um usuário
router.post('/user-create',UserController.createUser)

//Rota para ediatr um usuário pelo id
router.put('/user-update/:id',verify, UserController.updateUser)

//rota para listar o usuário pelo id
router.get('/user-list/:id', verify,UserController.listUser)

//rota para deletar um usuário
router.delete('/user-delete/:id',verify,UserController.deleteUser)



////////////////////////////////// TAREFAS///////////////
//rota para criar uma tarefa
router.post('/task-create',verify, TaskController.createTask)

//rota para editar uma tarefa
router.put('/task-update/:id', verify, TaskController.updateTask)

//rota para listar uma tarefa pelo id
router.get('/task-list/:id',verify, TaskController.listTask)

//rota para deletar uma tarefa pelo id
router.delete('/task-delete/:id',verify, TaskController.deleteTask)

//rota para colocar uma tarefa como concluida
router.post('/task/done/:id',verify, TaskController.doneTask)



///////////////////////////////////////ADMIN///////////////


//rota para listas todos os usuários com as tarefas
router.get('/user-list',verify, decode.validate, UserController.listUsers)

//rota para listas todas as tarefas com os usuário
router.get('/task-list', verify, decode.validate ,TaskController.listTasks)

//rota para listas todas as tarefas em atraso
router.get('/task-late',verify,decode.validate , TaskController.lateTask)


router.post('/login', UserController.login)



module.exports = router