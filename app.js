const express = require("express");
const app = express();
const cors = require("cors");
const userRouter = require("./router/userRouter");
const postRouter = require("./router/postRouter");
const commentRouter = require("./router/commentRouter");
const { prisma } = require("./lib/prisma");

const session = require("express-session");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const passport = require("passport");

// except localhost:5173
app.use(
  cors({
    origin: [process.env.CLIENT_URL, "http://localhost:5173"],
    credentials: true,
  }),
);

// turn off strict mode
app.set("strict routing", false);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//set up session store
const sessionStore = new PrismaSessionStore(prisma, {
  checkPeriod: 2 * 60 * 1000,
  dbRecordIdIsSessionId: true,
  dbRecordIdFunction: undefined,
});
app.use(
  session({
    store: sessionStore,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: "none",
    },
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);

// set up passport
app.use(passport.initialize());
app.use(passport.session());

// router
app.use("/api/posts", postRouter);
app.use("/api/users", userRouter);
app.use("/api/comments", commentRouter);

// error handler
app.use((err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || err.status || 500;

  return res.status(statusCode).json({
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT;
app.listen(PORT, (err) => {
  if (err) console.log(err);
  console.log("App listening on port", PORT);
});
