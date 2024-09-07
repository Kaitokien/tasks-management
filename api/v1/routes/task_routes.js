const express = require('express');
const router = express.Router();

const Task = require('../../../models/tasks_model');

router.get("/", async (req, res) => {
  const tasks = await Task.find({
    deleted: false
  })
  res.json(tasks);
});

router.get("/detail/:id", async (req, res) => {
  const id = req.params.id;
  
  const tasks = await Task.findOne({
    _id: id,
    deleted: false
  })

  res.json(tasks);
});

module.exports = router;