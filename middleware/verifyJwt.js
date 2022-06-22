const jwt =  require('jsonwebtoken');
module.exports = (req,res,next) =>{
    
    const token = req.headers.authorization.replace("Bearer ", "");
    if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });
    jwt.verify(token, process.env.SECRET, function (err,decode) {
        if (err) return res.status(403).json({ auth: false, message: 'Failed to authenticate token.' });
        
        req.usuario = decode
        next();
    })
}