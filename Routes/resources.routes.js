const express = require('express');
const router = express.Router();
const resourcesController = require('../Controllers/resources.controller')
const authMiddleware = require('../middlewares/authMiddleware');


//getAllResources
router.get('/getAllResources',authMiddleware , resourcesController.getAllResources);

//getResourceById
router.get('/:id', authMiddleware ,resourcesController.getResourceById);

//getResourcesByCategory
router.get('/category/:category' , resourcesController.getResourcesByCategory);


// //getResourceById
// router.get('/:user_id', authMiddleware, resourcesController.getResourceById);


module.exports = router;