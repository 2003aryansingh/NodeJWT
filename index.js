const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const postRoute = require('./routes/posts');


dotenv.config();

//connect to DB
mongoose.connect(process.env.MONGODB);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

//Middleware
app.use(express.json());


//imported routes here
const authRoute = require('./routes/auth');

//Route Middleware
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);


app.listen(3000, () => {
    console.log("Server is runnning!");
});