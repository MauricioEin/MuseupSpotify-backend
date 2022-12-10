const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const utilService = require('../../services/util.service')
const ObjectId = require('mongodb').ObjectId

async function query(filterBy = { txt: '' }) {
    try {
        // logger.debug('FILTERBY!', filterBy)
        const criteria = {
            name: { $regex: filterBy.name || '', $options: 'i' },
        }
        if (filterBy.category) criteria.category = filterBy.category
        if (filterBy.others) {
            criteria['owner._id'] = { "$ne": filterBy.others }
            criteria['owner.username'] = { "$ne": "MuseUp" }
        }
        if (filterBy.owner) criteria['owner._id'] = filterBy.owner
        if (filterBy.owner) logger.debug('CRITERIA', criteria)

        const collection = await dbService.getCollection('station')
        // logger.debug('collection')
        // logger.debug('criteria', criteria)



        // var stations = await collection.find(criteria).toArray()

        var stations = await collection.aggregate([
            {
                $match: criteria
            },
            {
                $addFields: {
                    firstSong: { $first: "$songs" },
                    createdAt: { $toDate: "$_id" }
                }
            },
            {
                $project:
                {
                    _id: 1,
                    name: 1,
                    desc: 1,
                    imgUrl: 1,
                    owner: { _id: 1, username: 1 },
                    firstSong: {
                        id: 1,
                        title: 1,
                        youtubeId: 1,
                        imgUrl: 1
                    },
                    createdAt: 1
                }
            },
            {
                $sort: { "createdAt": -1 }
            }
        ]).toArray()


        return stations
    } catch (err) {
        logger.error('cannot find stations', err)
        throw err
    }
}

async function getById(stationId) {
    try {
        logger.debug('stationId', stationId, typeof (stationId))
        const collection = await dbService.getCollection('station')
        logger.debug('stationId2')

        const station = collection.findOne({ _id: ObjectId(stationId) })
        // logger.debug('station', station)

        return station
    } catch (err) {
        logger.error(`while finding station ${stationId}`, err)
        throw err
    }
}

async function remove(stationId) {
    try {
        const collection = await dbService.getCollection('station')
        await collection.deleteOne({ _id: ObjectId(stationId) })
        return stationId
    } catch (err) {
        logger.error(`cannot remove station ${stationId}`, err)
        throw err
    }
}

async function add(station) {
    try {
        const collection = await dbService.getCollection('station')
        await collection.insertOne(station)
        return station
    } catch (err) {
        logger.error('cannot insert station', err)
        throw err
    }
}

async function update(station) {
    try {
        const stationToSave = {
            name: station.name,
            desc: station.desc,
            songs: station.songs,
            followers: station.followers,
            imgUrl: station.imgUrl,
        }
        const collection = await dbService.getCollection('station')
        await collection.updateOne({ _id: ObjectId(station._id) }, { $set: stationToSave })
        return station
    } catch (err) {
        logger.error(`cannot update station ${stationId}`, err)
        throw err
    }
}

async function addStationMsg(stationId, msg) {
    try {
        msg.id = utilService.makeId()
        const collection = await dbService.getCollection('station')
        await collection.updateOne({ _id: ObjectId(stationId) }, { $push: { msgs: msg } })
        return msg
    } catch (err) {
        logger.error(`cannot add station msg ${stationId}`, err)
        throw err
    }
}

async function removeStationMsg(stationId, msgId) {
    try {
        const collection = await dbService.getCollection('station')
        await collection.updateOne({ _id: ObjectId(stationId) }, { $pull: { msgs: { id: msgId } } })
        return msgId
    } catch (err) {
        logger.error(`cannot add station msg ${stationId}`, err)
        throw err
    }
}

module.exports = {
    remove,
    query,
    getById,
    add,
    update,
    addStationMsg,
    removeStationMsg
}
