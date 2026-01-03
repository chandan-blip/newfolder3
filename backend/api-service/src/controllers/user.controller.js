const userService = require('../services/user.service');
const { asyncHandler } = require('../middleware/errorHandler');

exports.getProfile = asyncHandler(async (req, res) => {
  const profile = await userService.getProfile(req.user.id);

  res.json({
    success: true,
    data: profile,
  });
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName, username } = req.body;
  const ipAddress = req.ip;
  const userAgent = req.get('user-agent');

  const updates = {};
  if (firstName !== undefined) updates.firstName = firstName;
  if (lastName !== undefined) updates.lastName = lastName;
  if (username !== undefined) updates.username = username;

  const user = await userService.updateProfile(
    req.user.id,
    updates,
    ipAddress,
    userAgent
  );

  res.json({
    success: true,
    message: 'Profile updated',
    data: { user },
  });
});

exports.getStats = asyncHandler(async (req, res) => {
  const stats = await userService.getStats(req.user.id);

  res.json({
    success: true,
    data: stats,
  });
});
