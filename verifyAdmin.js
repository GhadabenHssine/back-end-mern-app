const User = require("./models/User");
const jwt = require('jsonwebtoken')
require("dotenv").config({ path: "./.env" })
//admin acceess
const isAdmin = async (req, res, next) => {
    try {
        const token = req.headers["x-auth-token"];
        // console.log(token);

        if (!token) {
            return res.status(401).json("no token unauthoried")
        }
        const decoded = await jwt.verify(token, process.env.SECRET_KEY)
        // console.log(decoded);
        // try to get user by id
        const user = await User.findOne({ _id: decoded.id })
        console.log(user);
        if (!user) { return res.status(401).json("unauthoried") }
        if (!user.isAdmin) {
            return res.json("not admin ");
        }
        req.user = user;

        next()
    } catch (error) {

        return res.status(500).json("token err")
    }
}
module.exports = isAdmin


// const isAdminn = async (req, res, next) => {

//     //         //check if token
//     if (!req.user.isAdmin) {
//         return res.status(401).json("you are not admin user")
//     }
//     next();

// }
// module.exports = isAdminn

