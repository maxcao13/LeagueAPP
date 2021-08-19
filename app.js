// load .env variables
const dotenv = require('dotenv')
dotenv.config()
const PORT = process.env.PORT

const express = require('express')
const app = express()

app.get('/', (req, res)=>{
    res.send("HELLO WORLD")
})










app.listen(PORT, (req, res)=> {
    console.log(`user is listening on port ${PORT}...`)
})