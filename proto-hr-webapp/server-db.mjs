import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import mongoose from 'mongoose'

// Schema for the Heartrate model
const heartrateSchema = new mongoose.Schema({
    time: Date,
    heartrate: Number,
})

// Create the Heartrate model
const Heartrate = mongoose.model('heartrates', heartrateSchema)

// Schema for the user model
const userSchema = new mongoose.Schema({
    time: Date,
    user: String,
})

// Create the User model
const User = mongoose.model('users', userSchema)

// Connect to the mongo server, a database called 'heartratemonitor'
await mongoose.connect('mongodb://localhost:27017/heartratemonitor', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const currentFolder = path.dirname(fileURLToPath(import.meta.url))

const app = express()

app.use(express.json())

app.use('/', express.static(path.join(currentFolder, 'public')))

app.post('/heartrates', async (req, res) => {
    const hr = new Heartrate({
        time: Date(req.body.time),
        heartrate: req.body.heartrate,
    })
    await hr.save()
    res.json(hr)
})

app.get('/heartrates', async (req, res) => {
    let heartrates = await Heartrate.find({}).exec()
    res.json(heartrates)
})

// This retrieves the last 20 readings that were sent to the database
app.get('/heartrates/mostrecent', async (req, res) => {
    let heartrates = await Heartrate.find().sort({"time" : -1}).limit(20)
    // console.log(res)
    res.json(heartrates)
})

app.post('/users', async (req, res) => {
    const usr = new User({
        time: new Date(),
        user: req.body.user,
    })
    await usr.save()
    res.json(usr)
})

app.get('/users', async (req, res) => {
    let users = await User.find({}).exec()
    res.json(users)
})

// This retrieves the most recent user
app.get('/users/current', async (req, res) => {
    let user = await User.find().sort({"time" : -1}).limit(1)
    res.json(user)
})

app.listen(3000, () => {
    console.log('Listening at http://localhost:3000')
})