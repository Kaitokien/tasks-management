const md5 = require('md5');
const User = require('../models/user_model');
const generate = require('../../../helpers/generate');
const ForgotPassword = require('../models/forgot-password_model');
const sendMailHelper = require('../../../helpers/sendMail');

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

// [POST] /api/v1/users/login
module.exports.login = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await User.findOne({
    email: email,
    deleted: false
  })
  if(!user) {
    res.json({
      code: "400",
      message: ""
    })
    return;
  }
  if(md5(password) !== user.password) {
    res.json({
      code: "400",
      message: "Sai mat khau!"
    });
    return;
  }
  const token = user.token;
  res.cookie("token", token);
  res.json({
    code: "200",
    message: "Dang nhap thanh cong!",
    token: token
  })
}

// [POST] /api/v1/users/password/forgot
module.exports.forgotPassword = async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({
    email: email,
    deleted: false
  })
  if(!user) {
    res.json({
      code: "400",
      message: "Loi"
    })
    return;
  }

  const otp = generate.generateRandomNumber(8);
  const timeExpire = 5;
  const objectForgotPassword = {
    email: email,
    otp: otp,
    expired: Date.now() + timeExpire * 60
  }

  // Viec 1: Luu vao database
  const forgotPassword = new ForgotPassword(objectForgotPassword);
  await forgotPassword.save();
  // Viec 2: Gui OTP qua email
  const subject = "Mã OTP xác minh lấy lại mật khẩu";
  const html = `
  Mã OTP để lấy lại mật khẩu của bạn là <b>${otp}</b> (Sử dụng trong ${timeExpire} phút).
  Vui lòng không chia sẻ với bất kỳ ai.
  `
  sendMailHelper.sendMail(email, subject, html);
  res.json({
    code: "200",
    message: "Gui ma OTP thanh cong!"
  })
}

// [POST] /api/v1/users/password/otp
module.exports.otpPassword = async (req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;
  console.log(email, otp);
  const result = await ForgotPassword.findOne({
    email: email,
    otp: otp
  })

  console.log(result)

  if(!result) {
    res.json({
      code: "400",
      message: "Mã OTP không hợp lệ"
    });
    return;
  }
  const user = await User.findOne({ email: email });
  res.cookie("token", user.token);

  res.json({
    code: "200",
    message: "OTP xac thuc thanh cong!",
    token: user.token
  })
}