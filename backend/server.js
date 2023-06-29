const cors = require("cors");
const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MemoryStore = require("memorystore")(session);
const mysql = require("mysql2");
const sql = require("mssql");
const app = express();
const bodyParser = require("body-parser");
const userRoute = require("./routes/UserRoute/user.route");
const jobCategoriesRoute = require("./routes/JobCategoryRoute/job-categories.route");
const postsRoute = require("./routes/PostsRoute/posts.route");
const experienceRoute = require("./routes/ExperienceRoute/experience.route");
const educationRoute = require("./routes/EducationRoute/education.route");
const countryRoute = require("./routes/CountryRoute/country.route");
const qualificationRoute = require("./routes/Qualifications/qualifications.route")
const currencyRoute = require("./routes/CurrencyRoute/currency.route")
const budgetRoute = require("./routes/BudgetsRoute/budget.route")
const portfolioRoute = require("./routes/PortfolioRoute/portfolio.route")
const generalRoute = require("./routes/GeneralRoute/general.route")
const puppeteer = require("puppeteer");
// const JunctionRoute = require("./routes/JunctionRoute/junction.route");
const { sequelize } = require("./models");
const userService = require("./services/UserService/user.service");
const userController = require("./controllers/UserController/user.controller");
const userSocket = require("./wsHandler/userSocket");
const CONSTANT = require("./constants");
const router = require("express").Router();

const db = require("./models");
const Countries = db.countries;
const Universities = db.universities;
const UserProfile = db.userprofile;
const jwt_decode = require("jwt-decode");
const multer = require('multer');
const notificationSocket = require("./wsHandler/notificationSocket");
const upload = multer();
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
// app.use(session({
//   secret: 'your_secret_here',
//   resave: false,
//   saveUninitialized: true,
//   store: new MemoryStore({
//     checkPeriod: 86400000 // prune expired entries every 24h
//   })
// }));

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
  userSocket(socket, io);
  notificationSocket(socket, io)
  app.get("/v1/user/email-verified", (req, res) => {
    userController.emailVerified(req, res, socket, io);
  });
  // userService.emailVerified(socket, io)
  app.use("/v1/user", userRoute(socket, io));
};

io.on("connection", (socket) => {
  onConnection(socket);
});

app.use(bodyParser.json({ limit: "50mb" })); // for parsing application/json
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static(__dirname + "/public"));

app.use("/v1/job-categories", jobCategoriesRoute);
app.use("/v1/posts", postsRoute);
app.use("/v1/experience", experienceRoute);
app.use("/v1/education", educationRoute);
app.use("/v1/country", countryRoute);
app.use("/v1/qualification", qualificationRoute);
app.use("/v1/currency", currencyRoute)
app.use("/v1/budgets", budgetRoute)
app.use("/v1/portfolio", portfolioRoute)
app.use("/v1", generalRoute)
//crawl data for universities
// function delay(time) {
//   return new Promise(function (resolve) {
//     setTimeout(resolve, time);
//   });
// }
// (async () => {
//   const browser = await puppeteer.launch({
//     headless: false,
//     args: ["--window-size=1200,1080"],
//   });
//   const page = await browser.newPage();
//   await page.goto(
//     "https://github.com/endSly/world-universities-csv/blob/master/world-universities.csv",
//     {
//       waitUntil: "networkidle0",
//     }
//   );
//   await delay(2000);
//   await page.waitForSelector(".highlight");
//   const listLiElements = await page.$$(".highlight tr");
//   const records = await Promise.all(
//     Array.from(listLiElements).map(async (elm) => {
//       const hihi = await elm.evaluate((node) => {
//         return {
//           country_short_name: node.innerText.split(",")[0].replace("\t", ""),
//           university_name: node.innerText.split(",")[1],
//         };
//       });
//       return hihi;
//     })
//   );

//   const oidoioi  = records.map(async(record) => {
//      const countryFound = await Countries.findOne({
//       where: {
//         country_name: record.country_short_name
//       },
//       attributes: {
//         exclude: ['country_id']
//       }
//     })
//     if (countryFound) {
//       await Universities.create({
//         university_name: record.university_name,
//         country_id: countryFound.dataValues.id,
//       })
//     }
//   });
// })();

//Junction routes
// app.use("/v1", JunctionRoute)

sequelize.sync().then(() => {
  server.listen(port, () => {
    console.log(`server is running at ${port}`);
  });
});

module.exports.io = io;