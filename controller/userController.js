const User = require("../model/User");
const catchAsyncError = require("../utils/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");

const isStrongPassword = (password) => {
  const uppercaseRegex = /[A-Z]/;
  const lowercaseRegex = /[a-z]/;
  const numericRegex = /\d/;
  const specialCharRegex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/;

  if (
    uppercaseRegex.test(password) &&
    lowercaseRegex.test(password) &&
    numericRegex.test(password) &&
    specialCharRegex.test(password)
  ) {
    return true;
  } else {
    return false;
  }
};

const sendData = async (res, statusCode, user, message) => {
  const token = await user.getToken();
  user.password = undefined;
  res.status(statusCode).json({
    success: true,
    user,
    token,
    message,
  });
};

exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password, mobile, confirmPassword } = req.body;

  if (!isStrongPassword(password)) {
    return next(
      new ErrorHandler(
        "Password must contain one Uppercase, Lowercase, Numeric and Special Character",
        400
      )
    );
  }

  if (password !== confirmPassword)
    return next(new ErrorHandler("Confirm Password does not match", 400));

  const user_exist = await User.findOne({
    $or: [{ email: { $regex: new RegExp(email, "i") } }, { mobile }],
  });

  if (user_exist) {
    return next(new ErrorHandler(`Email/Mobile already exists`, 400));
  }

  let user = await User.create({
    name,
    email: email && email.toLowerCase(),
    password,
    mobile,
  });

  sendData(res, 201, user, "User Registered Successfully");
});

exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email & Password", 400));
  }

  const user = await User.findOne({
    email: { $regex: new RegExp(`^${email}$`, "i") },
  }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.matchPassword(password);
  if (!isPasswordMatched)
    return next(new ErrorHandler("Invalid email or password!", 401));

  sendData(res, 200, user, "User Logged In Successfully");
});

exports.getProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.userId).lean();
  if (!user) return next(new ErrorHandler("User not found.", 400));

  res.status(200).json({
    user,
  });
});

// update details & password
exports.updateDetails = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.userId);
  if (!user) return next(new ErrorHandler("User not found", 400));

  const { name, email, mobile } = req.body;

  const already_exists = await User.findOne({
    email: { $regex: new RegExp(`^${email}$`, "i") },
  });

  if (already_exists && already_exists._id.toString() !== req.userId) {
    return next(new ErrorHandler("Email already exists", 400));
  }

  if (name) user.name = name;
  if (email) user.email = email;
  if (mobile) user.mobile = mobile;

  await user.save();
  res.status(200).json({
    success: true,
    message: "User Updated Successfully",
  });
});

exports.updatePassword = catchAsyncError(async (req, res, next) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  if (!oldPassword || !newPassword || !confirmPassword)
    return next(new ErrorHandler("Please enter all fields", 400));

  if (!isStrongPassword(newPassword)) {
    return next(
      new ErrorHandler(
        "Password must contain one Uppercase, Lowercase, Numeric and Special Character",
        400
      )
    );
  }

  if (newPassword.length < 8)
    return next(new ErrorHandler("Password must be atleast 8 characters", 400));

  if (newPassword !== confirmPassword)
    return next(new ErrorHandler("Confirm Password does not match", 400));

  const user = await User.findById(req.userId).select("+password");
  if (!user) return next(new ErrorHandler("User not Found", 400));

  const isMatch = await user.matchPassword(oldPassword);

  if (!isMatch) {
    return next(new ErrorHandler("Invalid Old Password", 400));
  }

  if (isMatch && oldPassword === newPassword)
    return next(
      new ErrorHandler("New Password cannot be same as old password", 400)
    );

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password Updated successfully",
  });
});
