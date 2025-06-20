const express = require('express');
const router = express.Router();
const babyController = require('../Controllers/baby.controllers');


// getAllBabiesByUserId 
router.get('/getAllBabiesByUserId/:userId',babyController. getAllBabiesByUserId );

//getAllBabiesById
router.get('/getAllBabiesById/:id', babyController.getAllBabiesById);

//updateBabyById
router.put('/updateBabyById/:id', babyController.updateBabyById);

//deleteBabyById
router.delete('/deleteBabyById/:id', babyController.deleteBabyById);

  
module.exports = router;