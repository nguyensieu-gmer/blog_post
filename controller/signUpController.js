const { prisma } = require("../lib/prisma");
const { body, matchedData, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { jwtExpire } = require("../variables");

const maxLengthOfPassword = 6;

const validate = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage(
      "User name can not be empty, we will use it as public user in you account.",
    ),
  body("email").trim().isEmail().withMessage("Please enter your email."),
  body("password")
    .trim()
    .isLength({ min: maxLengthOfPassword })
    .withMessage(
      `Your password must more than ${maxLengthOfPassword} characters`,
    ),
  body("confirmpassword")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage(
      "your confirm password is not same with password. Please try it again!",
    ),
];

const checkNameAndEmail = async (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res
      .status(400)
      .json({ message: "validated error", error: result.array() });
  }
  const { username, email, password } = matchedData(req);

  try {
    const userEmail = await prisma.user.findUnique({
      where: { email: email },
    });
    if (userEmail) {
      return res.status(409).json({ message: "Email has alreadly existed!" });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Some thing went wrong in network please try again.",
    });
  }

  try {
    const userName = await prisma.user.findUnique({
      where: { name: username },
    });
    if (userName) {
      return res
        .status(409)
        .json({ message: "This name has alreadly existed!" });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Some thing went wrong in network please try again.",
    });
  }
  req.customValidateData = { username, email, password };
  next();
};

const createUser = async (req, res, next) => {
  const { username, email, password } = req.customValidateData;
  let user;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    user = await prisma.user.create({
      data: {
        name: username,
        email: email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to register user.", success: false });
  }
  req.logIn(user, (err) => {
    if (err) {
      return next(err);
    }
    jwt.sign(
      user,
      process.env.JWT_SECRET,
      { expiresIn: jwtExpire },
      (err, token) => {
        if (err) {
          return next(err);
        }
        res.status(200).json({
          success: true,
          message: "Sign up sucessful",
          token,
          user,
        });
      },
    );
  });
};

const postSignUpUser = [validate, checkNameAndEmail, createUser];

module.exports = { postSignUpUser };
