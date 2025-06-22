const express = require('express');
const router = express.Router();
const userController = require('../Controllers/user.controllers')
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require("../middlewares/Multer");

//getAllUsers

router.get('/getAllUsers' ,userController.getAllUsers);

// getUserById
router.get('/getUserById/:id',authMiddleware , userController.getAllUsersById);

//updateUserById
router.put('/updateUserById/:id' , upload.single("profile_picture"),  userController.updateUserById);

//deleteUserById
router.delete('/deleteUserById/:id', userController.deleteUserById);

  
module.exports = router;