const { Router } = require("express");
const userRouter = Router();
const signUpController = require("../controller/signUpController");
const logInController = require("../controller/logInController");
const logOutController = require("../controller/logOutController");

userRouter.post("/sign-up", signUpController.postSignUpUser);
userRouter.post("/log-in", logInController.postLogIn);
userRouter.post("/log-out", logOutController.postLogOut);

module.exports = userRouter;
