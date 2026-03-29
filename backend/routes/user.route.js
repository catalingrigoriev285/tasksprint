const express = require('express');
const { adminOnly, protect } = require('../middlewares/auth.middleware');
const { getUsers, getUserById, createUser, updateUser, deleteUser } = require('../controllers/user.controller');

const router = express.Router();

router.get('/', protect, adminOnly, getUsers);
router.get('/:id', protect, adminOnly, getUserById);
router.post('/', protect, adminOnly, createUser);
router.put('/:id', protect, adminOnly, updateUser);
router.delete('/:id', protect, adminOnly, deleteUser);

module.exports = router;