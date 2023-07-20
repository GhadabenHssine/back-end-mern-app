const router = require('express').Router();
const User = require('../models/User')
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken")

// Register

router.post("/register", async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString()

    });
    try {
        const user = await newUser.save()
        return res.status(201).json(user)
    } catch (error) {
        return res.status(500).json(error);

    }


})
// login

router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) { return res.status(401).json("Wrong password or username") };

        var bytes = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
        var originalPassword = bytes.toString(CryptoJS.enc.Utf8);
        if (originalPassword !== req.body.password) { return res.status(401).json("Wrong password or username") };

        // // Creating Json Web Token

        const accessToken = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.SECRET_KEY,
            { expiresIn: "5d" }
        );
        const { password, ...info } = user._doc;
        return res.status(201).json({ ...info, accessToken })

    } catch (error) {
        return res.status(501).json(error)
    }
})


module.exports = router