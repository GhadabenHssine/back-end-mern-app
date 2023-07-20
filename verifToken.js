const jwt = require('jsonwebtoken')
const User = require("./models/User")
require('dotenv').config({ path: "./.env" })
const isAuth = async (req, res, next) => {
    try {
        const token = req.headers["x-auth-token"];
        //         //check if token
        if (!token) {
            return res.status(401).json("no token unauthoried")
        }
        const decoded = await jwt.verify(token, process.env.SECRET_KEY)
        // try to get user by id
        const user = await User.findById(decoded.id)
        if (!user) { return res.status(401).json("unauthoried") }
        req.user = user;

        next()
    } catch (error) {

        return res.status(500).json("token err")
    }
}
module.exports = isAuth




