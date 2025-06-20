const jwt = require('jsonwebtoken');
const User = require('../db/Models/userModel');

const authMiddleware = async (req, res, next) => {
  try {
    //check if token exist 
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    // Make sure the secret exists
    if (!process.env.JWT_SECRET_KEY) {
      console.error('JWT_SECRET_KEY is not defined in environment variables');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded; // Attach user data to request

    // check if user exist 
    const current_user = await User.findByPk(decoded.user_id); 
    if(!current_user){
      return res.status(401).json({message:'user that belong to this token is no longer exists'})
    }

    next();
  } catch (error) {
    console.error('Auth error:', error.name, error.message);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    } else {
      return res.status(401).json({ message: 'Authentication failed' });
    }
  }
};

module.exports = authMiddleware;
