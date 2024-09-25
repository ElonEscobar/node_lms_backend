const mongoose = require('mongoose')

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,

  },
  content: {
    type: String,
    required: true,
  },
  // files: [{
  //   type: String,
  //   required: false,
  // }],
  // links: [{
  //   type: String,
  //   required: false,
  // }],
  
  // quiz: {
  //   type: String,
  //   required: false,
  // },
  // status: {
  //   type: String,
  //   required: false,
  // },
  // submissions: {
  //   type: String,
  //   required: false,
  // },

  course: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Course'}
})

module.exports = mongoose.model("Lesson", lessonSchema);

