const authToken = (req, res, next) => {
  const xToken = req.headers['x-token'];
  if (!xToken) { return res.status(401).json({ error: 'Unauthorized' }); }
  req.token = xToken;
  return next();
};

export default authToken;
