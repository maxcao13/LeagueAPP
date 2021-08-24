// load .env variables
const dotenv = require('dotenv')
dotenv.config()
const PORT = process.env.PORT
const PATCH = "11.16.1"

const path = require('path')

const express = require('express')
const pug = require('pug')
const app = express()
const api_key = "RGAPI-94d63258-447a-47b1-97b5-574bd7deead5"
const { err_handle, getChampionFromID } = require("./public/methods")

const axios = require('axios')

app.use(express.static('./public'))
app.set('views', './views')
app.set('view engine', 'pug')

async function freeChamps(req, res, next) {
    async function getFreeChamps(idArray) {
        try {
            let champ_response = (await axios.get(`http://ddragon.leagueoflegends.com/cdn/${PATCH}/data/en_US/champion.json`)).data.data
            return idArray.map(x => getChampionFromID(champ_response, x))
        }
        catch (e) {
            console.log(e)
            return
        }
    }

    try {
        let api_res = await axios.get(`https://na1.api.riotgames.com/lol/platform/v3/champion-rotations?api_key=${api_key}`)
        req.body = await getFreeChamps(api_res.data.freeChampionIds)
    }
    catch (e) {
        err_handle(e, res)
        return
    }
    next()
}

async function getSummonerInfo(req, res, next) {
    try{
        const {name} = req.query
        let api_res = await axios.get(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}?api_key=${api_key}`)
        req.body = api_res.data
        console.log(req.body)

    }
    catch (e) {
        err_handle(e, res)
        return
    }
    next()
}

app.get('/', freeChamps, (req, res) => {
    res.status(200).render('index', {list: req.body})
})

app.get('/lol/query', getSummonerInfo, (req, res)=>{
    res.status(200).render('league', {name: req.body.name, level: req.body.summonerLevel, icon: req.body.profileIconId})
})


app.listen(PORT, (req, res)=> {
    console.log(`user is listening on port ${PORT}...`)
})
