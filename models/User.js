const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: {
    type: String,
    enum: ['Teacher','Student'],
    required: true,
  },
  enrolledCourses:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]

})

module.exports = mongoose.model('User', userSchema)