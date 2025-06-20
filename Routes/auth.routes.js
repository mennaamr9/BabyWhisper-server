const express = require('express');
const router = express.Router();
const authController = require('../Controllers/auth.controller');
const upload = require("../middlewares/Multer");
const validateRequest = require('../middlewares/validateRequest');
const {registerSchema} = require('../db/Validators/registerValidation');



//register
router.post('/register' , upload.single("profile_picture") ,authController.register );

// validateRequest(registerSchema)
//verify
// router.get('/verify-email/:id', authController.verifyEmail);

//login   
router.post('/login', authController.Login);


//forgetPassword 
router.post('/forgetPassword', authController.FrogetPass);

//VerifyResetCode 
router.post('/VerifyResetCode', authController.VerifyResetCode);

//resetPassword
router.post('/resetPassword', authController.ResetPass);

  
module.exports = router;