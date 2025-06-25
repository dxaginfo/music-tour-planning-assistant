const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

/**
 * Authenticate middleware
 * Verifies JWT token and attaches user to request object
 */
exports.authenticate = async (req, res, next) => {
  let token;

  // Check if token exists in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

      // Find user by id and exclude password
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

/**
 * Authorize middleware
 * Checks if user has required role
 * @param {string[]} roles - Array of allowed roles
 */
exports.authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, no user' });
    }

    // Check if user role is in allowed roles
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Role ${req.user.role} is not authorized to access this resource`
      });
    }

    next();
  };
};

/**
 * Resource ownership middleware
 * Checks if user owns the resource or has admin role
 * @param {Function} resourceFetcher - Function to fetch the resource
 * @param {string} idParamName - Name of the ID parameter in the request
 */
exports.checkResourceOwnership = (resourceFetcher, idParamName = 'id') => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params[idParamName];
      const resource = await resourceFetcher(resourceId);

      if (!resource) {
        return res.status(404).json({ message: 'Resource not found' });
      }

      // Check if user is resource owner or admin
      const isOwner = resource.createdBy && 
                      resource.createdBy.toString() === req.user._id.toString();
      const isAdmin = req.user.role === 'admin';
      
      // Check if user is a member with permissions (for tour resources)
      let hasMemberPermission = false;
      if (resource.members && typeof resource.hasPermission === 'function') {
        hasMemberPermission = resource.hasPermission(req.user._id, 'write');
      }

      if (isOwner || isAdmin || hasMemberPermission) {
        // Attach resource to request for future use
        req.resource = resource;
        next();
      } else {
        res.status(403).json({ message: 'Not authorized to access this resource' });
      }
    } catch (error) {
      res.status(500).json({
        message: 'Error checking resource ownership',
        error: error.message
      });
    }
  };
};