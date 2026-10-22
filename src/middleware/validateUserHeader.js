export const validateUserHeader = (req, res, next) => {
   if (!req || !req.headers) {
    return res.status(500).json({
      success: false,
      message: 'Server Error: Invalid Request Object',
    });
  }

  const userId = req.headers['X-User-Id'] || req.headers['x-user-id'];


  if (!userId || typeof userId !== 'string' || userId.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'X-User-Id header is required',
    });
  }

  req.userId = userId.trim();
  next();
};