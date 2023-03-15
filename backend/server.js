const cors = require("cors");
const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

const mysql = require('mysql2');
const sql = require("mssql");
const app = express();
const bodyParser = require('body-parser');
const userRoute = require("./routes/user.route")
// import userRoute from "./routes/userRoute"
dotenv.config();

const port = process.env.NODE_PORT

const dbConnection = mysql.createConnection ({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

dbConnection.connect((err) => {
    if(err) throw err
    console.log("Database connected !")
})

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.use(bodyParser.json()); // for parsing application/json

app.use("/v1/user", userRoute)


app.listen(port, () => {
    console.log(`server is running at ${port}`)
})

module.exports = dbConnection