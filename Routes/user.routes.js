const express = require('express');
const router = express.Router();
const userController = require('../Controllers/user.controllers')


//getAllUsers

router.get('/getAllUsers',userController.getAllUsers);

// getUserById
router.get('/getUserById/:id', userController.getAllUsersById);

//updateUserById
router.put('/updateUserById/:id', userController.updateUserById);

//deleteUserById
router.delete('/deleteUserById/:id', userController.deleteUserById);

  
module.exports = router;