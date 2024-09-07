const Task = require('../models/tasks_model');

// [GET] /api/v1/tasks
module.exports.index = async (req, res)  => {
  let find = {
    deleted: false
  };
  // Bo loc
  if(req.query.status) {
    find.status = req.query.status
  }
  // Het bo loc
  const tasks = await Task.find(find);
  res.json(tasks);
}

// [GET] /api/v1/tasks/detail/:id
module.exports.detail = async (req, res) => {
  const id = req.params.id;
  
  const tasks = await Task.findOne({
    _id: id,
    deleted: false
  })

  res.json(tasks);
}