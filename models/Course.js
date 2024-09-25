const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {

    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    // objectives: [
    //   {
    //     type: String,
    //     required: true,
    //   },
    // ],
    // timeCommitment: {
    //   type: String,
    //   required: true,
    // },
    // courseLanguage: {
    //   type: String,
    //   required: true,
    // },
    // videoTranscript: {
    //   type: String,
    //   required: true,
    // },
    // difficulty: {
    //   type: String,
    //   required: true,
    // },
    // price: {
    //   type: Number,
    //   required: true,
    // },
    // completion: {
    //   type: Number,
    //   required: true,
    // },
    lessons: [{ type: mongoose.Schema.Types.ObjectId,  ref: 'Lesson'}],
    creators: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Course", courseSchema);
