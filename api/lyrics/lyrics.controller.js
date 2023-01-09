
const lyricsService = require('./lyrics.service.js')

const logger = require('../../services/logger.service')

module.exports = {
  getLyrics
}


async function getLyrics(req, res) {
  const apiKey = req.query.apikey
  const searchStr = req.query.q
  const { artist, track } = lyricsService.getTrackObject(searchStr)
  try {
    const lyrics = await lyricsService.getLyrics(apiKey, artist, track, searchStr)
    res.json(lyrics)
  } catch (err) {
    res.status(500).send({ err: 'Failed to get lyrics' })
  }
}

