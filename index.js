const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const app = express();
const cors = require('cors')
require('dotenv').config()
const getCurrentDateTime = require('./common/getCurrentDateTime')
const path = require('path');
 

//Define Routes here
const UserRoutes = require('./routes/UserRoutes')
const PostRoutes = require('./routes/postRoutes')




//Use dot env
PORT = process.env.PORT
connectionString = process.env.DBConnectionString
frontEndConnectionString = process.env.frontEndConnectionString



app.get('/',(req,res)=>{
  const formattedDate = getCurrentDateTime();
  res.send(`Server is running... DateTime is: ${formattedDate}`);
})


// Start using Node------------------------------------------------------------------------

app.use(cors({
  credentials: true,
  origin:[frontEndConnectionString]
}))

app.use(cookieParser())
app.use(express.json())




app.use(express.urlencoded({ extended: true }));
//express.static() makes the files in the specified directory accessible over HTTP requests.
//app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



app.use("/user",UserRoutes)
app.use("/post",PostRoutes)
 

//Connection Code
mongoose.connect(connectionString)
  .then(() => {
    console.log("Connected to database");
   
    app.listen(PORT, () => {
      console.log(`App is listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database", err);
  }); 