const md5 = require('md5');
const User = require('../models/user_model');
const generate = require('../../../helpers/generate');

// [POST] /api/v1/users/register
module.exports.register = async (req, res) => {
  const existEmail = await User.findOne({
    email: req.body.email,
    deleted: false
  });
  if(existEmail) {
    res.json({
      code: "400",
      message: "Email da ton tai!"
    });
    return;
  }
  const infoUser = {
    fullName: req.body.fullName,
    email: req.body.email,
    password: md5(req.body.password),
    token: generate.generateRandomString(30)
  }
  const user = new User(infoUser);
  await user.save();
  res.cookie("token", user.token);
  res.json({
    token: user.token,
    code: "200",
    message: "Tao tai khoan thanh cong!"
  })
}
