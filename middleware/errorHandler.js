const errorHandler = (err, req, res, next) => {
    console.error("Error: ", err.message, err.stack);
    res.status(500).json({ error: err.message || 'Something went wrong!' });
  };
  
  module.exports = errorHandler;