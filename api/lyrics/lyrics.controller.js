
const lyricsService = require('./lyrics.service.js')

const logger = require('../../services/logger.service')

module.exports = {
  getLyrics
}


async function getLyrics(req, res) {
  logger.debug('GOT HERE!!')
  const apiKey = req.query.apikey
  const searchStr = req.query.q
  const { artist, track } = lyricsService.getTrackObject(searchStr)
  try {
    const lyrics = await lyricsService.getLyrics(apiKey, artist, track, searchStr)
    console.log('lyrics:', lyrics)
    res.json(lyrics)
  } catch (err) {
    logger.debug('got to err:', err)
    res.status(500).send({ err: 'Failed to get lyrics' })
  }
}

