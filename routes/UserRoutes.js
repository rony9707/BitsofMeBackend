const { Router } = require('express')
const router = Router()
const {registerUser} = require('../controller/userController/userRegister')
const upload = require('../common/uploadImage')
const userLoginController = require('../controller/userController/userLogin')
const authMiddleware = require('../middleware/authMiddleware')
const userGetController = require('../controller/userController/userGet')
const userLogoutController = require('../controller/userController/userLogout')


router.post('/register', upload('uploads/profilePic').single('image'), registerUser)
router.post('/login', userLoginController.loginUser)
router.get('/getUser', authMiddleware, userGetController.getUser)
router.post('/logout', authMiddleware, userLogoutController.logoutUser)

module.exports = router;