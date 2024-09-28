const jwt = require('jsonwebtoken');
const JWT_SECRET = 'anasisagoodb$oy'; // This should be the same everywhere


const fetchUser = (req, res, next) => {
  // Get the user from JWT token and add id to request object
  const token = req.header('auth-token');
  
  // If no token is found in the request header
  if (!token) {
    return res.status(401).send({ error: 'Please authenticate using a valid token 1' });
  }

  try {
    // Verify the token using the JWT_SECRET
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;  // Attach user data to request object
    next();  // Proceed to the next middleware/route handler
  } catch (error) {
    // If the token is invalid or verification fails
    return res.status(401).send({ error: 'Please authenticate using a valid token 2' });
  }
};

module.exports = fetchUser;
