const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { authLimiter } = require('../middleware/rateLimiter');
const {
  registerValidation,
  loginValidation,
  refreshTokenValidation,
  changePasswordValidation,
} = require('../validators/auth.validators');

// Public routes
router.post(
  '/register',
  authLimiter,
  validate(registerValidation),
  authController.register
);

router.post(
  '/login',
  authLimiter,
  validate(loginValidation),
  authController.login
);

router.post(
  '/refresh',
  authLimiter,
  validate(refreshTokenValidation),
  authController.refreshToken
);

// Protected routes
router.post('/logout', authenticate, authController.logout);

router.post('/logout-all', authenticate, authController.logoutAll);

router.post(
  '/change-password',
  authenticate,
  validate(changePasswordValidation),
  authController.changePassword
);

router.get('/me', authenticate, authController.me);

module.exports = router;
