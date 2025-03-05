const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require('dotenv').config();
const dbConfig = require("./config/dbConfig");
const mongoose = require("mongoose");
const User = require('./models/User');
var userRoute = require("./routes/user_route");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); 


app.use("/api", userRoute);


// Start the server
const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`Node server started at port ${port}`));


