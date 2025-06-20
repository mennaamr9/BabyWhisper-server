const express = require('express');
const router = express.Router();
const schedulesController = require('../Controllers/schedule.controller')


//getAllSchedules
router.get('/getAllSchedules', schedulesController.getAllSchedules);


//getSchedulesByAge
router.get('/:age_group', schedulesController.getSchedulesByAge);



  
module.exports = router;