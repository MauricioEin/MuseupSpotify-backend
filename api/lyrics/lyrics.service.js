const axios = require('axios')


const logger = require('../../services/logger.service')
const utilService = require('../../services/util.service')


async function getLyrics(apiKey, artist, track, searchStr) {
    var trackRes = await axios.get(`https://api.musixmatch.com/ws/1.1/track.search?apikey=${apiKey}&q_artist=Doja%20Cat&q_artist=${artist}&q_track=${track}&f_has_lyrics=1`)
    var trackId = trackRes.data.message.body.track_list[0]?.track?.track_id || null
    console.log('TRACKID:', trackId)
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

async function query(filterBy = { txt: '' }) {
    try {
        const criteria = {
            // vendor: { $regex: filterBy.txt, $options: 'i' }
        }
        const collection = await dbService.getCollection('car')
        // logger.debug('collection')
        // logger.debug('criteria', criteria)
        var cars = await collection.find().toArray()
        return cars
    } catch (err) {
        logger.error('cannot find cars', err)
        throw err
    }
}

async function getById(carId) {
    try {
        const collection = await dbService.getCollection('car')
        const car = collection.findOne({ _id: ObjectId(carId) })
        return car
    } catch (err) {
        logger.error(`while finding car ${carId}`, err)
        throw err
    }
}

async function remove(carId) {
    try {
        const collection = await dbService.getCollection('car')
        await collection.deleteOne({ _id: ObjectId(carId) })
        return carId
    } catch (err) {
        logger.error(`cannot remove car ${carId}`, err)
        throw err
    }
}

async function add(car) {
    try {
        const collection = await dbService.getCollection('car')
        await collection.insertOne(car)
        return car
    } catch (err) {
        logger.error('cannot insert car', err)
        throw err
    }
}

async function update(car) {
    try {
        const carToSave = {
            vendor: car.vendor,
            price: car.price
        }
        const collection = await dbService.getCollection('car')
        await collection.updateOne({ _id: ObjectId(car._id) }, { $set: carToSave })
        return car
    } catch (err) {
        logger.error(`cannot update car ${carId}`, err)
        throw err
    }
}

async function addCarMsg(carId, msg) {
    try {
        msg.id = utilService.makeId()
        const collection = await dbService.getCollection('car')
        await collection.updateOne({ _id: ObjectId(carId) }, { $push: { msgs: msg } })
        return msg
    } catch (err) {
        logger.error(`cannot add car msg ${carId}`, err)
        throw err
    }
}

async function removeCarMsg(carId, msgId) {
    try {
        const collection = await dbService.getCollection('car')
        await collection.updateOne({ _id: ObjectId(carId) }, { $pull: { msgs: { id: msgId } } })
        return msgId
    } catch (err) {
        logger.error(`cannot add car msg ${carId}`, err)
        throw err
    }
}

module.exports = {
    getLyrics,
    getTrackObject
}
