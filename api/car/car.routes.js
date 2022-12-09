const express = require('express')
const axios = require('axios')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { getCars, getCarById, addCar, updateCar, removeCar, addCarMsg, removeCarMsg } = require('./car.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)
router.get('/lyrics', async (req, res) => {
    try {
        const res = await axios.get('https://api.musixmatch.com/ws/1.1/track.search?apikey=4e363a325cb491b46e4c3c11b59c8cb7&q_artist=Doja%20Cat&q_track=Need%20to%20Know&f_has_lyrics=1')
        const trackId = res.data.message.body.track_list[0].track.track_id
        const res2 = await axios.get('https://api.musixmatch.com/ws/1.1/track.lyrics.get?apikey=4e363a325cb491b46e4c3c11b59c8cb7&track_id=' + trackId)
        const lyr = res2.data.message.body.lyrics.lyrics_body
        console.log('lyr',lyr)
        res.json(lyr);
    } catch (err) {
        res.send(err)
    }

})

router.get('/', log, getCars)
router.get('/:id', getCarById)
router.post('/', requireAuth, addCar)
router.put('/:id', requireAuth, updateCar)
router.delete('/:id', requireAuth, removeCar)
// router.delete('/:id', requireAuth, requireAdmin, removeCar)

router.post('/:id/msg', requireAuth, addCarMsg)
router.delete('/:id/msg/:msgId', requireAuth, removeCarMsg)

module.exports = router