const express = require('express')
const app = express()
const mongoose = require('mongoose');
const dotenv = require("dotenv")
const authRoute = require('./routes/auth')
const userRoute = require('./routes/users')
const movieRoute = require('./routes/movies')
const listRoute = require('./routes/lists')
dotenv.config()

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("db connection successfull !")).catch(err => console.log(err))
const PORT = 5000;
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', authRoute)
app.use('/api/users', userRoute)
app.use('/api/movies', movieRoute)
app.use('/api/lists', listRoute)



app.listen(PORT, () => {
    console.log(`backend  server is running in port ${PORT}`);
})