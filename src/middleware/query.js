const advancedResults = (model) => async (req, res, next) => {
  let query = model.find({ user: req.user.id });

  // Select only pending or complete tasks
  if(['pending', 'complete'].includes(req.query.status)) {
    query.where({ status: req.query.status });
  }

  // Sorting
  if(req.query.sort) {
    const sortBy = req.query.sort.replaceAll(',', ' ');
    query.sort(sortBy)
  }
  else {
    query.sort('-createdAt');
  }
  
  const results = await query;

  res.results = {
    success: true,
    count: results.length,
    data: results
  };

  next();
};

module.exports = advancedResults;
