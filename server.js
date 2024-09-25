const express = require('express');
require('dotenv').config()
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3500
const { logger, logEvents } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/dbConn')
const mongoose = require('mongoose')

connectDB()

app.use(cookieParser())
app.use(logger)
app.use(express.json())
app.use(cors(corsOptions))


// check for more resources on /public
app.use('/', express.static(path.join(__dirname, 'public')))

app.use('/', require('./routes/root'))
app.use('/auth', require('./routes/authRoutes'))

app.use('/users', require('./routes/userRoutes'))
app.use('/courses', require('./routes/courseRoutes'))
app.use('/lessons', require('./routes/lessonRoutes'))





// handle 404
app.all('*', (req, res)=>{
  res.status(404)
  if(req.accepts('html')){
    res.sendFile(path.join(__dirname, 'views', '404.html'))
  }else if(req.accepts('json')){
    res.json({ message: '404 Not found'})
  }else{
    res.type('txt').send('404 Not found')
  }
})

app.use(errorHandler)

mongoose.connection.once('open',()=>{
  console.log('Connected to MongoDB')
  app.listen(PORT, ()=> console.log(`server running on ${PORT}`))
})

mongoose.connection.once('error',()=>{
  console.log('error')
  logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})
