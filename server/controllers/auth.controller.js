const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// Helper function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'fallback_secret',
    { expiresIn: '30d' }
  );
};

/**
 * Register a new user
 * @route POST /api/auth/register
 * @access Public
 */
exports.register = async (req, res) => {
  try {
    const { email, password, name, role, phone } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = await User.create({
      email,
      password,
      name,
      role,
      phone
    });

    // Generate token
    const token = generateToken(user._id);

    // Return user data and token
    res.status(201).json({
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
      token
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error registering user',
      error: error.message
    });
  }
};

/**
 * Login user
 * @route POST /api/auth/login
 * @access Public
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email }).select('+password');

    // Check if user exists and password is correct
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(user._id);

    // Return user data and token
    res.json({
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
      profileImage: user.profileImage,
      token
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error logging in',
      error: error.message
    });
  }
};

/**
 * Get current user profile
 * @route GET /api/auth/profile
 * @access Private
 */
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
      profileImage: user.profileImage,
      preferences: user.preferences,
      createdAt: user.createdAt
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error getting user profile',
      error: error.message
    });
  }
};

/**
 * Update user profile
 * @route PUT /api/auth/profile
 * @access Private
 */
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, profileImage, preferences } = req.body;

    // Find user
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (profileImage) user.profileImage = profileImage;
    if (preferences) user.preferences = { ...user.preferences, ...preferences };

    // Save user
    await user.save();

    res.json({
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
      profileImage: user.profileImage,
      preferences: user.preferences
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating user profile',
      error: error.message
    });
  }
};

/**
 * Change password
 * @route PUT /api/auth/change-password
 * @access Private
 */
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Find user
    const user = await User.findById(req.user.id).select('+password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if current password is correct
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({
      message: 'Error changing password',
      error: error.message
    });
  }
};