const LoginModel = require("../models/LoginModel")
const generateToken = require('../utils/generateToken')

const loginUser = async (req, res, next) => {
    const { username, password } = req.body
        try{
            const data = await LoginModel.findUser(username, password)
            const token = generateToken(data[0].username, data[0].role)
                    res.cookie('token', token, {
                        httpOnly: true,
                        secure: true, 
                        sameSite: 'None', 
                        maxAge: 3600000
            });
            res.json({ login: true });
        }catch(err){
            next(err)
        }
}

module.exports = loginUser