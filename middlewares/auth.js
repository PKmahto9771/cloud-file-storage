const jwt = require('jsonwebtoken');

const checkAuth = (req, res, next) =>{
    const token = req.cookies?.uid;
    // console.log("Issued token:", token);
    // console.log("Token from cookie:", req.cookies.uid); 

    if(!token){
        if (req.accepts('html')) {
            return res.redirect('/api/auth/login');
        }
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch(err){
        if (req.accepts('html')) {
            return res.redirect('/api/auth/login');
        }
        return res.status(400).json({ message: 'Invalid token.' });
    }
}

module.exports = checkAuth;