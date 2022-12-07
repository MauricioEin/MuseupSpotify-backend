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
    console.log('car',car)
    // car.owner = 'mau'
    const addedCar = await carService.add(car)
    console.log('addedCar',addedCar)

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
  const {loggedinUser} = req
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
  const {loggedinUser} = req
  try {
    const carId = req.params.id
    const {msgId} = req.params

    const removedId = await carService.removeCarMsg(carId, msgId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove car msg', err)
    res.status(500).send({ err: 'Failed to remove car msg' })

  }
}

module.exports = {
  getCars,
  getCarById,
  addCar,
  updateCar,
  removeCar,
  addCarMsg,
  removeCarMsg
}
