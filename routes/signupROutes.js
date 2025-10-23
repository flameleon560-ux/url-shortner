const express = require('express');
const { handleUserSignup, handleUserLogin, handleForgotPassword,handleverifyOtp,handleResetPassword } = require('../controller/signupController');
const router = express.Router();
const multer=  require('multer');
// const upload = multer({ dest: 'uploads/' })
// const storage=multer.diskStorage({
//     destination: function (req, file, cb) {
//     cb(null, './uploads')
//   },
//   filename: function (req, file, cb) {
//     cb(null,Date.now()+ file.originalname)
//   }
// })
// const upload=multer({storage})
const upload =multer({storage:multer.memoryStorage()});
router.post('/createuser',upload.single('profile'), handleUserSignup);
router.post('/loginuser', handleUserLogin);
router.post('/forgotpassword',handleForgotPassword);
router.post('/verifyotp',handleverifyOtp);
router.post('/resetpassword',handleResetPassword);

module.exports = router;
