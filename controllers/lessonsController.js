const Lesson = require('../models/Lesson')
const Course = require("../models/Course");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");
// const bcrypt = require('bcrypt')

const getAllLessons = asyncHandler(async (req, res) => {
  const lessons = await Lesson.find().lean();
  if (!lessons?.length) {
    return res.status(400).json({ message: "No lessons found" });
  }
  res.json(lessons);
});

// create a new lesson
const createNewLesson = asyncHandler(async (req, res) => {

  const { title, content, courseId } = req.body;
  if (!title || !content) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const duplicate = await Lesson.findOne({ title }).lean().exec();
  if (duplicate) {
    return res.status(409).json({ message: "Duplicate lesson title" });
  }

  const lessonObj = { title, content, course: courseId };

  const lesson = await Lesson.create(lessonObj);
  if (lesson) {
    res.status(201).json({ message: `New lesson: ${title} created!` });
  } else {
    res.status(400).json({ message: "Invalid lesson data" });
  }
});

// make updates to lesson
const updateLesson = asyncHandler(async (req, res) => {
  const { id, title, content } = req.body;

  if (!id || !title || !content) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const lesson = await Lesson.findById(id).exec();

  if (!lesson) {
    return res.status(404).json({ message: "Lesson not found" });
  }
  // check duplicate
  const duplicate = await Lesson.findOne({ title }).lean().exec();
  // allow updates to the original lesson
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate lesson title found" });
  }
  lesson.title = title;
  lesson.content = content;

  const updatedLesson = await lesson.save();
  res.json({ message: "Updated lesson" });
});

const deleteLesson = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Lesson ID is required" });
  }

  const lesson = await Lesson.findById(id).exec();
  if (!lesson) {
    return res.status(400).json({ message: "Lesson not found" });
  }
  const result = await Lesson.deleteOne();
  const reply = `Lesson ${result.title} has been deleted`;

  res.json(reply);
});

module.exports = {
  getAllLessons,
  createNewLesson,
  updateLesson,
  deleteLesson,
};
