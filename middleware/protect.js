const jwt = require('jsonwebtoken')

const protect = (req, res, next) => {
    const token = req.cookies.token;
    if(token){
        try {
            const decoded = jwt.verify(token, process.env.ACCESSTOKEN)
            //res.json({ username: decoded.username, role: decoded.role })
            req.user = decoded
            next()
        } catch (err) {
            next(err)
        }
    } else {
       res.status(500).json({msg:"Server error"})
    }
}

module.exports = protect