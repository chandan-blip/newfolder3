const authService = require('../services/auth.service');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

exports.register = asyncHandler(async (req, res) => {
  const { email, username, password, firstName, lastName } = req.body;
  const ipAddress = req.ip;
  const userAgent = req.get('user-agent');

  const result = await authService.register(
    { email, username, password, firstName, lastName },
    ipAddress,
    userAgent
  );

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    data: result,
  });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const ipAddress = req.ip;
  const userAgent = req.get('user-agent');

  const result = await authService.login(
    { email, password },
    ipAddress,
    userAgent
  );

  res.json({
    success: true,
    message: 'Login successful',
    data: result,
  });
});

exports.refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  const ipAddress = req.ip;

  const result = await authService.refreshAccessToken(refreshToken, ipAddress);

  res.json({
    success: true,
    message: 'Token refreshed',
    data: result,
  });
});

exports.logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  await authService.logout(req.user.id, req.token, refreshToken);

  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

exports.logoutAll = asyncHandler(async (req, res) => {
  await authService.logoutAll(req.user.id);

  res.json({
    success: true,
    message: 'Logged out from all devices',
  });
});

exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const ipAddress = req.ip;
  const userAgent = req.get('user-agent');

  await authService.changePassword(
    req.user.id,
    currentPassword,
    newPassword,
    ipAddress,
    userAgent
  );

  res.json({
    success: true,
    message: 'Password changed successfully',
  });
});

exports.me = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: { user: req.user },
  });
});
