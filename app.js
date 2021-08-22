// load .env variables
const dotenv = require('dotenv')
dotenv.config()
const PORT = process.env.PORT

const path = require('path')

const express = require('express')
const pug = require('pug')
const app = express()
const api_key = "RGAPI-dc83d539-8879-4991-9a47-698eeb8575f7"

const axios = require('axios')

app.use(express.static('./public'))
app.set('views', './views')
app.set('view engine', 'pug')

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
//http://ddragon.leagueoflegends.com/cdn/10.18.1/img/profileicon/24.png

async function getSummonerInfo(req, res, next) {
    const {name} = req.query
    let response = await getData(name)
    if (response) {
        // res.send(`${response.name}: ${response.summonerLevel}`)
        // console.log(response)
        req.body = response
    }
    else {
        res.status(404).send(`There does not exist a summoner with the name: "${name}"`)
    }
    next()
}

app.get('/', (req, res) => {
    res.status(200).end()
})

app.get('/lol/query', getSummonerInfo, (req, res)=>{
    res.render('league', {name: req.body.name, level: req.body.summonerLevel})
})


app.listen(PORT, (req, res)=> {
    console.log(`user is listening on port ${PORT}...`)
})
