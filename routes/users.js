const router = require("express").Router();

const User = require("../models/User")
const CryptoJS = require("crypto-js");

const isAuth = require("../verifToken");

// create
router.post("/", isAuth, async (req, res) => {
    if (req.user.isAdmin) {

        if (req.body.password) {
            req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString();
        }
        const newUsers = new User(req.body)
        try {

            const savedUser = await newUsers.save();
            return res.status(201).json(savedUser)
        } catch (error) {
            return res.status(501).json(error)
        }


    } else {
        return res.status(401).send("You are not allowed !")
    }

})

// //Update user 
// router.put("/:id", isAuth, async (req, res) => {
//     console.log(req.user);
//     if (req.user.id === req.params.id || req.user.isAdmin) {
//         if (req.body.password) {
//             req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString();
//         }
//         try {
//             const updateUser = await User.findByIdAndUpdate(req.params.id, {
//                 $set: req.body,
//             }, { new: true });
//             return res.status(201).json(updateUser)
//         } catch (error) {
//             return res.status(501).json(err)
//         }
//     } else {
//        status(403).send("you can update only your account")
//     }
// })
router.put("/:id", isAuth, async (req, res) => {
    try {
        if (req.user.id === req.params.id) {
            if (req.body.password) {
                req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString()
                // console.log(req.body.password)

            }

            // console.log(req.user);
            // console.log(req.params.id)
            console.log(req.body.password)
            const updateUser = await User.updateOne({ _id: req.params.id }, { $set: { ...req.body } })

            // console.log("test", updateUser)
            // if (!updateUser) {
            //     return res.status(404).json({ message: "User not found" });
            // }

            return res.status(200).json({ msg: "user updated..." });

        } else {
            return res.status(403).json({ message: "You can only update your own account" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});









//Delette user 
router.delete("/:id", isAuth, async (req, res) => {

    console.log(req.user);
    if (req.user.id === req.params.id || req.user.isAdmin) {

        try {
            await User.findByIdAndDelete(req.params.id)
            return res.status(201).json("User has been deleted ...")
        } catch (error) {
            return res.status(501).json(err)
        }
    } else {
        res.status(403).send("you can delete only your account")
    }

})


//get user by id 
router.get("/find/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        const { password, ...info } = user._doc;
        return res.status(201).json(info)
        console.log(user);
    } catch (error) {
        return res.status(501).json(error)
    }
})



//get all user
router.get("/", isAuth, async (req, res) => {
    const query = req.query.new
    if (req.user.isAdmin) {

        try {
            const users = query ? await User.find().sort({ _id: -1 }).limit(5) : await User.find()

            return res.status(201).json(users)
        } catch (error) {
            return res.status(501).json(err)
        }
    } else {
        return res.status(501).json("you are not allowed to see all users!")
    }

})

// get user stats
router.get("/stats", async (req, res) => {
    const today = new Date();
    const latYear = today.setFullYear(today.setFullYear() - 1);


    try {
        const data = await User.aggregate([
            {
                $project: {
                    month: { $month: "$createdAt" },
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: 1 },
                },
            }
        ])
        return res.status(201).json(data)
    } catch (error) {
        return res.status(501).json(error)
    }
})










module.exports = router