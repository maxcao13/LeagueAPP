// load .env variables
const dotenv = require('dotenv')
dotenv.config()
const PORT = process.env.PORT
const api_key = process.env.API_KEY
const PATCH = "11.16.1"

const path = require('path')

const express = require('express')
const pug = require('pug')
const app = express()

const { err_handle, getChampionFromID, getWinrate } = require("./methods")

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

async function getSummonerStats(req, res, next) {
    try{
        encryptedSummonerID = await req.body.id
        let api_res = await axios.get(`https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/${encryptedSummonerID}?api_key=${api_key}`)
        req.stats = api_res.data
        console.log(req.stats)

    }
    catch (e) {
        err_handle(e, res)
        return
    }
    next()
}

app.get('/', freeChamps, (req, res) => {
    res.status(200).render('index', {PATCH: `${PATCH}`, list: req.body})
})

app.get('/lol/query', getSummonerInfo, getSummonerStats, (req, res)=>{
    res.status(200).render('league', {PATCH: `${PATCH}`, name: req.body.name, level: req.body.summonerLevel, 
    icon: req.body.profileIconId, flexstats: req.stats[0], sdstats: req.stats[1], 
    flexWinrate: getWinrate(req.stats[0].wins, req.stats[0].losses),
    sdWinrate: getWinrate(req.stats[1].wins, req.stats[1].losses)})
})


app.listen(PORT, (req, res)=> {
    console.log(`user is listening on port ${PORT}...`)
})
