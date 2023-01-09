const axios = require('axios')


const logger = require('../../services/logger.service')
const utilService = require('../../services/util.service')


async function getLyrics(apiKey, artist, track, searchStr) {
    var trackRes = await axios.get(`https://api.musixmatch.com/ws/1.1/track.search?apikey=${apiKey}&q_artist=Doja%20Cat&q_artist=${artist}&q_track=${track}&f_has_lyrics=1`)
    var trackId = trackRes.data.message.body.track_list[0]?.track?.track_id || null
    if (!trackId) {
        trackRes = await axios.get(`https://api.musixmatch.com/ws/1.1/track.search?apikey=${apiKey}&q_artist=Doja%20Cat&q=${searchStr}&f_has_lyrics=1`)
        var trackId = trackRes.data.message.body.track_list[0]?.track?.track_id || null
    }
    if (!trackId) return ''
    const res2 = await axios.get(`https://api.musixmatch.com/ws/1.1/track.lyrics.get?apikey=${apiKey}&track_id=` + trackId)
    return `${artist.trim()}\n${track.trim()}\n\n` + res2.data.message.body.lyrics.lyrics_body
}

function getTrackObject(str) {
    var idx = str.indexOf('-')
    if (idx === -1) {
        idx = str.indexOf('|')
        if (idx === -1) {
            idx = str.indexOf(':')
            if (idx === -1) idx = 0
        }
    }
    var idx2 = str.indexOf('(')
    if (idx2 === -1) {
        idx2 = str.indexOf('[')
        if (idx2 === -1) idx2 = Infinity
    }
    var idx3 = idx2 > idx ? idx2 : Infinity
    return {
        artist: str.slice(0, Math.min(idx, idx2)),
        track: str.slice(idx + 1, idx3)
    }
}


module.exports = {
    getLyrics,
    getTrackObject
}
