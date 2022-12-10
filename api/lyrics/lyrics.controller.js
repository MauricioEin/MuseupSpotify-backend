const axios = require('axios')


const carService = require('./car.service.js')

const logger = require('../../services/logger.service')

async function getCars(req, res) {
  try {
    // logger.debug('Getting Cars')
    const filterBy = {
      txt: req.query.txt || ''
    }
    //  logger.debug('filterBy',filterBy)

    const cars = await carService.query(filterBy)
    // logger.debug('CARS',cars)
    res.json(cars)
  } catch (err) {
    logger.error('Failed to get cars', err)
    res.status(500).send({ err: 'Failed to get cars' })
  }
}

async function getCarById(req, res) {
  try {
    const carId = req.params.id
    const car = await carService.getById(carId)
    res.json(car)
  } catch (err) {
    logger.error('Failed to get car', err)
    res.status(500).send({ err: 'Failed to get car' })
  }
}

async function addCar(req, res) {
  // console.log('req', req)
  // console.log('req.body', req.body)
  // console.log('req.loggedinUser', req.loggedinUser)
  // const {loggedinUser} = req

  try {
    const car = req.body
    console.log('car', car)
    // car.owner = 'mau'
    const addedCar = await carService.add(car)
    console.log('addedCar', addedCar)

    res.json(addedCar)
  } catch (err) {
    logger.error('Failed to add car', err)
    res.status(500).send({ err: 'Failed to add car' })
  }
}


async function updateCar(req, res) {
  try {
    const car = req.body
    const updatedCar = await carService.update(car)
    res.json(updatedCar)
  } catch (err) {
    logger.error('Failed to update car', err)
    res.status(500).send({ err: 'Failed to update car' })

  }
}

async function removeCar(req, res) {
  try {
    const carId = req.params.id
    const removedId = await carService.remove(carId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove car', err)
    res.status(500).send({ err: 'Failed to remove car' })
  }
}

async function addCarMsg(req, res) {
  const { loggedinUser } = req
  try {
    const carId = req.params.id
    const msg = {
      txt: req.body.txt,
      by: loggedinUser
    }
    const savedMsg = await carService.addCarMsg(carId, msg)
    res.json(savedMsg)
  } catch (err) {
    logger.error('Failed to update car', err)
    res.status(500).send({ err: 'Failed to update car' })

  }
}

async function removeCarMsg(req, res) {
  const { loggedinUser } = req
  try {
    const carId = req.params.id
    const { msgId } = req.params

    const removedId = await carService.removeCarMsg(carId, msgId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove car msg', err)
    res.status(500).send({ err: 'Failed to remove car msg' })

  }
}

async function getLyrics(req, res) {
  try {
    console.log('GOT HEREEE')
    console.log('req.query.q', req.query.q)

    const { artist, track } = _getTrackObject(req.query.q)
      var trackRes = await axios.get(`https://api.musixmatch.com/ws/1.1/track.search?apikey=4e363a325cb491b46e4c3c11b59c8cb7&q_artist=Doja%20Cat&q_artist=${artist}&q_track=${track}&f_has_lyrics=1`)
      var trackId = trackRes.data.message.body.track_list[0]?.track?.track_id || null
      console.log('TRACKID:', trackId)
      if (!trackId) {
        trackRes = await axios.get(`https://api.musixmatch.com/ws/1.1/track.search?apikey=4e363a325cb491b46e4c3c11b59c8cb7&q_artist=Doja%20Cat&q=${req.query.q}&f_has_lyrics=1`)
        var trackId = trackRes.data.message.body.track_list[0]?.track?.track_id || null
      }
      if (!trackId) return res.send('')
      const res2 = await axios.get('https://api.musixmatch.com/ws/1.1/track.lyrics.get?apikey=4e363a325cb491b46e4c3c11b59c8cb7&track_id=' + trackId)
      const lyr = res2.data.message.body.lyrics.lyrics_body
      console.log('lyr:', lyr)
      res.json(lyr)
  } catch (err) {
    res.send(err)
  }
}

function _getTrackObject(str) {
  console.log('str', str)
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
  console.log('1,2,3:', idx, idx2, idx3)
  return {
    artist: str.slice(0, Math.min(idx, idx2)),
    track: str.slice(idx + 1, idx3)
  }
}

module.exports = {
  getCars,
  getCarById,
  addCar,
  updateCar,
  removeCar,
  addCarMsg,
  removeCarMsg,
  getLyrics
}
