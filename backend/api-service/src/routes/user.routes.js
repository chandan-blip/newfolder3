const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { updateProfileValidation } = require('../validators/user.validators');

// All routes require authentication
router.use(authenticate);

router.get('/profile', userController.getProfile);

router.put(
  '/profile',
  validate(updateProfileValidation),
  userController.updateProfile
);

router.get('/stats', userController.getStats);

module.exports = router;
