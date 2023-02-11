const asyncHandler = func => (req, res, next) => {
  return Promise.resolve(func(req, res, next)).catch(next);
};

module.exports = asyncHandler;

// This function eliminates the need for a try/catch block inside our async methods