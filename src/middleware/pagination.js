const pagination = (req, results) => {
  // Pagination params
  const page =  + req.query.page || 1;
  const limit = req.query.limit || 25;
  const startingIndex = (page - 1) * limit;
  const endingIndex =  page * limit;
  const count = results.length;
  
  // Filter results
  results = results.slice(startingIndex, endingIndex);

  // Pagination object
  let pagination = {};
  if(startingIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    }
  }
  if(endingIndex < count) {
    pagination.next = {
      page: page + 1,
      limit
    }
  }

  const data = {
    count: results.length,
    pagination,
    data: results
  };

  return data;
};

module.exports = pagination;
