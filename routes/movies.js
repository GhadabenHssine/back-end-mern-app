const router = require("express").Router();

const isAuth = require("../verifToken");
const Movies = require("../models/Movie")

// create
router.post("/", isAuth, async (req, res) => {
    if (req.user.isAdmin) {
        const newMovies = new Movies(req.body)
        try {

            const savedMovies = await newMovies.save();
            return res.status(201).json(savedMovies)
        } catch (error) {
            return res.status(501).json(error)
        }


    } else {
        return res.status(401).send("You are not allowed !")
    }

})

// update
router.put("/:id", isAuth, async (req, res) => {
    if (req.user.isAdmin) {

        try {

            const updateMovies = await Movies.findByIdAndUpdate(req.params.id, {
                $set: req.body
            }, { new: true });
            return res.status(200).json(updateMovies)
        } catch (error) {
            return res.status(501).json(error)
        }


    } else {
        return res.status(401).send("You are not allowed !")
    }

})

// delete
router.delete("/:id", isAuth, async (req, res) => {
    if (req.user.isAdmin) {

        try {

            await Movies.findByIdAndDelete(req.params.id)

            return res.status(200).json("movie has been deleted ....")
        } catch (error) {
            return res.status(501).json(error)
        }


    } else {
        return res.status(401).send("You are not allowed !")
    }

})

// Get by id
router.get("/find/:id", isAuth, async (req, res) => {
    try {
        const movie = await Movies.findById(req.params.id)
        return res.status(200).json(movie)
    } catch (error) {
        return res.status(501).json(error)
    }
})

// Get random
router.get("/random", isAuth, async (req, res) => {
    const type = req.query.type;
    let movie;
    try {
        if (type === "series") {
            movie = await Movies.aggregate
                ([
                    { $match: { isSeries: true } },
                    { $sample: { size: 1 } },

                ]);
        } else {
            movie = await Movies.aggregate
                ([
                    { $match: { isSeries: false } },
                    { $sample: { size: 1 } },
                ]);
        }
        return res.status(201).send(movie)
    } catch (error) {
        return res.status(501).json(error)
    }
})



// router.get("/random/:type", isAuth, async (req, res) => {
//     const type = req.params.type;


//     try {
//         if (!type) {
//             res.status(400).json("the is no type")
//         }
//         if (type === "movies") {
//             let count = await Movies.countDocuments({ isSeries: false })

//             if (count = 0) {
//                 return res.status(201).json("no movies");
//             }

//             const randomIndex = Math.floor(Math.random() * count)
//             console.log(randomIndex);
//             const randomMovie = Movies.findOne()
//             console.log(randomMovie);
//             return res.status(201).json({ message: "geting random movie succées", result: randomMovie })

//         } else {
//             let count = await Movies.countDocuments({ isSeries: true })
//             if (count = 0) {
//                 return res.status(201).json("no movies");
//             }

//             const randomIndex = Math.floor(Math.random() * count)
//             const randomMovie = Movies.findOne({ isSeries: true })
//             return res.status(201).json({ message: "geting random series succées", result: randomMovie })
//         }

//     } catch (error) {
//         return res.status(501).json(error)
//     }
// })




// get all
router.get("/", isAuth, async (req, res) => {
    if (req.user.isAdmin) {
        try {
            const movies = await Movies.find()
            return res.status(200).json(movies.reverse())
        } catch (error) {
            return res.status(501).json(error)
        }
    } else {
        return res.status(401).send("You are not allowed !")
    }

})


module.exports = router