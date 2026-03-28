const express = require('express');

const { registerUser, loginUser, getUserProfile, updateUserProfile, uploadProfileImage } = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

// Authentication routes
router.post('/register', registerUser);
router.post('/login', loginUser);


// User profile routes
router.get('/profile', protect, getUserProfile);
router.put('/profile/update', protect, updateUserProfile);
router.post('/profile/image', protect, uploadProfileImage);

module.exports = router;