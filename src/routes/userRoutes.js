const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { userSchema } = require('../schemas/UserSchema');

// GET /users - Get all users
router.get('/', auth, UserController.getAll);

// GET /users/:id - Get user by ID
router.get('/:id', auth, UserController.getById);

// POST /users - Create new user
router.post('/', 
  auth, 
  validate(userSchema.create), 
  UserController.create
);

// PUT /users/:id - Update user
router.put('/:id', 
  auth, 
  validate(userSchema.update), 
  UserController.update
);

// DELETE /users/:id - Delete user
router.delete('/:id', auth, UserController.delete);

module.exports = router;
