const cors = require("cors");
const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

const mysql = require("mysql2");
const sql = require("mssql");
const app = express();
const bodyParser = require("body-parser");
const userRoute = require("./routes/UserRoute/user.route");
const jobCategoriesRoute = require("./routes/JobCategoryRoute/job-categories.route");
const postsRoute = require("./routes/PostsRoute/posts.route");
// const JunctionRoute = require("./routes/JunctionRoute/junction.route");
const { sequelize } = require("./models");
const userService = require("./services/UserService/user.service");
const userController = require("./controllers/UserController/user.controller");
const userSocket = require("./wsHandler/userSocket");
const CONSTANT = require("./constants");
const router = require("express").Router();

const db = require("./models");
const UserProfile = db.userprofile
const jwt_decode = require("jwt-decode");
// const verifiedEmailSuccess = require("./services/UserService/user.service");
// const returnDataSocket = require("./wsHandler/returnDataSocket");
// import userRoute from "./routes/userRoute"
dotenv.config();

const port = process.env.NODE_PORT;

const dbConnection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

dbConnection.connect((err) => {
  if (err) throw err;
  console.log("Database connected !");
});

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// io.on("connection", function (socket) {
//   console.log("Client connected!.");
//   socket.on("disconnect", function () {});
//   socket.emit("connect success", { data: "You have successfully connected!", socket_id: socket.id });
//   socket.on("Client-sent-data", function (data) {
//     socket.emit("Server-sent-data", data);
//   });
// });



const onConnection = (socket) => {
  // const {TOKEN, USER_INFO} = CONSTANT.WS_EVENT
  console.log("Client connected!.");
  socket.on("disconnect", function () {});
  // socket.on(TOKEN, async (token) => {
  //   const decoded = jwt_decode(token)
  //    const user = await UserProfile.findOne({
  //     id: decoded.id
  //   })
  //   socket.emit(USER_INFO, {user: user})
  // })
  userSocket(socket, io)
  app.get("/v1/user/email-verified", (req, res) => {
    userController.emailVerified(req, res, socket, io)
  });
  // userService.emailVerified(socket, io)
};

io.on("connection", (socket) => {
  onConnection(socket)
})

app.use(bodyParser.json({ limit: "50mb" })); // for parsing application/json
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);
app.use(express.static(__dirname + "/public"));

app.use("/v1/user", userRoute);
app.use("/v1/job-categories", jobCategoriesRoute);
app.use("/v1/posts", postsRoute);

//Junction routes
// app.use("/v1", JunctionRoute)

sequelize.sync().then(() => {
  server.listen(port, () => {
    console.log(`server is running at ${port}`);
  });
});

module.exports.io = io;
