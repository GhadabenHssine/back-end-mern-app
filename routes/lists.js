const router = require("express").Router();

const isAuth = require("../verifToken");
const List = require("../models/List");
const { verify } = require("jsonwebtoken");


// Get by id
router.get("/find/:id", isAuth, async (req, res) => {
    try {
        const movie = await List.findById(req.params.id)
        return res.status(200).json(movie)
    } catch (error) {
        return res.status(501).json(error)
    }
})

// create
router.post("/", isAuth, async (req, res) => {
    if (req.user.isAdmin) {
        const newList = new List(req.body)
        try {
            const savedList = await newList.save();
            return res.status(201).json(savedList);

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
            await List.findByIdAndDelete(req.params.id)
            return res.status(201).json(" the list has been deleted ...");
        } catch (error) {
            return res.status(501).json(error)
        }
    } else {
        return res.status(401).send("You are not allowed !")
    }

})

// get 
router.get("/", verify, async (req, res) => {
    const typeQuery = req.query.type;
    const genreQuery = req.query.genre;
    let list = [];
    try {
        if (typeQuery) {
            if (genreQuery) {
                list = await List.aggregate([
                    { $sample: { size: 10 } },
                    { $match: { type: typeQuery, genre: genreQuery } }
                ])

            } else {
                list = await List.aggregate([
                    { $sample: { size: 10 } },
                    { $match: { type: typeQuery } }
                ])
            }

        } else {
            list = await List.aggregate([
                { $sample: { size: 10 } }
            ])
        }
        res.status(201).json(list)
    } catch (error) {
        return res.status(500).json(error)
    }
})


// update
router.put("/:id", isAuth, async (req, res) => {
    if (req.user.isAdmin) {

        try {

            const updateLists = await List.findByIdAndUpdate(req.params.id, {
                $set: req.body
            }, { new: true });
            return res.status(200).json(updateLists)
        } catch (error) {
            return res.status(501).json(error)
        }


    } else {
        return res.status(401).send("You are not allowed !")
    }

})



module.exports = router