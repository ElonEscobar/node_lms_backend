const express = require('express')
const router =  express.Router()
const lessonsController = require('../controllers/lessonsController')
const verifyJWT = require('../middleware/verifyJWT')

// router.use(verifyJWT)

router.route('/')
  .get(lessonsController.getAllLessons)
  .post(lessonsController.createNewLesson)
  .patch(lessonsController.updateLesson)
  .delete(lessonsController.deleteLesson)

module.exports = router