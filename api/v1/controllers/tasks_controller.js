const Task = require('../models/tasks_model');
const paginationHelper = require('../../../helpers/pagination');
const searchHelper = require('../../../helpers/search');

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

  // Search
  const objectSearch = searchHelper(req.query);

  if(objectSearch.regex) {
    find.title = objectSearch.regex;
  }
  // End Search

  // Pagination
  const countTasks = await Task.countDocuments(find);
  let objectPagination = paginationHelper(
    {
      currentPage: 1,
      limitItems: 2
    },
    req.query,
    countTasks
  );

  // End Pagination

  // Sort
  const sort = {};
  if(req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  }
// End sort

  const tasks = await Task.find(find)
  .sort(sort)
  .limit(objectPagination.limitItems)
  .skip(objectPagination.skip);;
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

// [PATCH] /api/v1/tasks/change-status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    const id = req.params.id;

    console.log(req.body);

    await Task.updateOne({
      _id: id
    }, {
      status: req.body.status
    });

    res.json({
      code: 200,
      message: "Cập nhật trạng thái thành công!"
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Cập nhật trạng thái không thành công!"
    });
  }
}

// [PATCH] /api/v1/tasks/change-multi
module.exports.changeMulti = async (req, res) => {
  try {
    const { ids, key, value } = req.body;
    switch (key) {
      case "status":
        await Task.updateMany({ _id: {$in: ids} }, { status: value })
        res.json({
          code: 200,
          message: "Cập nhật trạng thái thành công!"
        })
        break;
      case "deleted":
        await Task.updateMany({ _id: {$in: ids} }, { 
          deleted: true,
          deletedAt: new Date()
        })
        res.json({
          code: 200,
          message: "Xóa thành công!"
        })
        break;
      default:
        res.json({
          code: 400,
          message: "Cập nhật trạng thái không thành công!"
        });
        break;
    }

  } catch (error) {
    res.json({
      code: 400,
      message: "Cập nhật trạng thái không thành công!"
    });
  }
}

// [POST] /api/v1/tasks/create
module.exports.create = async (req, res) => {
  try {
    const task = new Task(req.body);
    const data = await task.save();

    res.json({
      code: 200,
      message: "Tao thanh cong!",
      data: data
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Loi!"
    })
  }
}

// [PATCH] /api/v1/tasks/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    await Task.updateOne({ _id: id }, req.body);
    res.json({
      code: 200,
      message: "Tao thanh cong!"
    });

  } catch (error) {
    console.log(error);
    res.json({
      code: 400,
      message: "Loi!"
    })
  }
}

// [DELETE] /api/v1/tasks/delete/:id
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    await Task.updateOne({ _id: id }, {
      deleted: true,
      deletedAt: new Date()
    });
    res.json({
      code: 200,
      message: "Xóa thành công!"
    });

  } catch (error) {
    console.log(error);
    res.json({
      code: 400,
      message: "Loi!"
    })
  }
}