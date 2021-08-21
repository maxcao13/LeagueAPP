// load .env variables
const dotenv = require('dotenv')
dotenv.config()
const PORT = process.env.PORT

const path = require('path')

const express = require('express')
const app = express()
const api_key = "RGAPI-8be9c778-adcd-4aea-81e7-795bb64cf04d"

const axios = require('axios')

app.use(express.static('./public'))

const getData = async(summonerName) => {
    try{
        let resp = await axios.get(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${api_key}`)
        return resp.data
    }
    catch (error) {
        console.log(error);
        return
    }

}

app.get('/', (req, res) => {
    res.status(200).end()
})

app.get('/lol/query', (req, res)=>{
    const {name} = req.query
    async function run() {
        let response = await getData(name)
        if (response) {
            res.send(JSON.stringify(`${response.name}: ${response.summonerLevel}`))
            console.log(response)
        }
        else {
            return res.status(200).json({ success: true, data: [] })
        }
    }
    run()
})


app.listen(PORT, (req, res)=> {
    console.log(`user is listening on port ${PORT}...`)
})
