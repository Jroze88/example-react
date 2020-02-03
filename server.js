require("dotenv").config();
const http = require("http");
// const createError = require('http-errors');
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const bodyParser = require("body-parser");
// const firebase = require('firebase')
// const admin = require('firebase-admin');
// const appconfig = JSON.parse(process.env.FIREBASE_APP);

var realtimeconfig;
var PORT;
// var appconfig;
// var serviceAccount;
var database;

//////////////////////////////////////////// 'PRODUCTION' vs 'DEV' Environment Cases need reorganizing

const app = express();

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "client/build")));

app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    "http://asoiafreporting.herokuapp.com"
  ); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// if (process.env.NODE_ENV === "production") {
//   // realtimeconfig =  JSON.parse(process.env.FIREBASE_REAL_TIME)

//   // serviceAccount =  JSON.parse(process.env.FIREBASE)

//   PORT = process.env.PORT;

//   // admin.initializeApp({
//   //   credential: admin.credential.cert(serviceAccount),
//   //   databaseURL: "https://asoiafapp.firebaseio.com"
//   // });

//   firebase.initializeApp(realtimeconfig);

//   database = firebase.database();

//   app.post("/newUserRegistration", req => {
//     let newUser = req.body.user.user;

//     let tag = newUser.uid;

//     console.log(newUser);

//     database
//       .ref("users/" + tag)
//       .set({
//         user: newUser
//       })
//       .catch(function(error) {
//         console.log(error);
//       });

//     database.ref("users/" + tag).off();
//   });

//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
//   });

//   const server = http.createServer(app);

//   const server_port = process.env.PORT;
//   const server_host = process.env.HOST || "0.0.0.0";
//   server.listen(server_port, server_host, () => {
//     console.log("Listening on port %d", server_port);
//   });
// } else {
const log = require("log-to-file");
// const memwatch = require('memwatch-next');

// serviceAccount =  require('./firebase.json')
realtimeconfig = require("./firebaseRealtime");
PORT = 3001;
// firebase = require('firebase')

firebase.initializeApp(realtimeconfig);

database = firebase.database();

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://asoiafapp.firebaseio.com"
// });

app.post("/newUserRegistration", req => {
  let newUser = req.body.user.user;

  let tag = newUser.uid;

  console.log(newUser);

  database
    .ref("users/" + tag)
    .once()
    .set({
      user: newUser
    })
    .catch(function(error) {
      console.log(error);
    });

  database.ref("users/" + tag).off();
});

// Send every request to the React app
// Define any API routes before this runs
app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "client/build/index.html"));
});

app.listen(PORT, function() {
  console.log(`Mixing it up on port: ${PORT}`);
});
// }

// console.log(appconfig)

// app.get('/firebaseconfig', function(req, res) {

//   res.send({
//     firebaseConfig: appconfig
//   })

// })

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
// }
