
module.exports = {
    async validate(req,res,next){
        const dados = req.user
        if(dados.user_type == "admin"){
            next()
        }else{
            return res.status(401).json({msg: 'Usuario não tem autorização'});
        }
    }
}