const express = require('express')
const {getLyrics } = require('./lyrics.controller')
const router = express.Router()


router.get('/', getLyrics)

module.exports = router