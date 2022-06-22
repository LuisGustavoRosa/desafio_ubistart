const jwt =  require('jsonwebtoken');

module.exports = {
    async validate(req,res,next){
        const dados = req.usuario
        if(dados.tipo_user == 'admin'){
            next()
        }else{
            return res.status(401).json({msg: 'Usuario não tem autorização'});
        }
    }
}