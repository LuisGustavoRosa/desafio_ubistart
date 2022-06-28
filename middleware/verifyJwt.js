const jwt =  require('jsonwebtoken');
module.exports = (req,res,next) =>{
    
    const [,token] = req.headers.authorization.split(' ');
    if (!token) return res.status(401).json({ message: 'No token provided.' });
    jwt.verify(token, process.env.SECRET, function (err,decode) {
        if (err) return res.status(403).json({ auth: false, message: 'Failed to authenticate token.' });
        req.user = decode
        next();
        
    })
}