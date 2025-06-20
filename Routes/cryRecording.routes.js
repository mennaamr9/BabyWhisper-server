const express = require('express');
const router = express.Router();
const upload = require("../middlewares/Multer");
const cryRecordingController = require('../Controllers/cryRecording.controllers')
const authMiddleware = require('../middlewares/authMiddleware');




//uploadRecords
router.post('/uploadRecords', 
            authMiddleware,
            upload.single("file") ,
            cryRecordingController.uploadRecords);

//getAllRecords
router.get('/getAllRecords',cryRecordingController.getAllRecords);

//getRecordsById
router.get('/getRecordsById/:id', cryRecordingController.getRecordsById);

//getRecordsByBaby
router.get('/getRecordsByBaby/:babyId', cryRecordingController.getRecordsByBaby);

//deleteRecordsById
router.delete('/deleteRecordsById/:id', cryRecordingController.deleteRecordsById);

  
module.exports = router;