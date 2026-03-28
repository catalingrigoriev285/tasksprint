const express = require('express');

const { registerUser, loginUser, getUserProfile, updateUserProfile } = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

// Authentication routes
router.post('/register', registerUser);
router.post('/login', loginUser);


// User profile routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

module.exports = router;