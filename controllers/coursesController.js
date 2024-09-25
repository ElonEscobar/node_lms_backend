// const User = require('../models/User')
const Course = require("../models/Course");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");
// const bcrypt = require('bcrypt')

const getAllCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find().lean();
  if (!courses?.length) {
    return res.status(400).json({ message: "No courses found" });
  }
  res.json(courses);
});

// create a new course
const createNewCourse = asyncHandler(async (req, res) => {
  const { title, desc } = req.body;
  if (!title || !desc) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const duplicate = await Course.findOne({ title }).lean().exec();
  if (duplicate) {
    return res.status(409).json({ message: "Duplicate course title" });
  }

  // get current userId
  const user = req.user;
  const userId = await User.findOne({ user });
  const courseObj = { title, desc, creators: userId._id };

  const course = await Course.create(courseObj);
  if (course) {
    res.status(201).json({ message: `New course: ${title} created!` });
  } else {
    res.status(400).json({ message: "Invalid course data" });
  }
});

// !make updates to courses
const updateCourse = asyncHandler(async (req, res) => {
  const { id, title, desc } = req.body;

  if (!id || !title || !desc) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const course = await Course.findById(id).exec();

  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }
  // check duplicate
  const duplicate = await Course.findOne({ title }).lean().exec();
  // allow updates to the original user
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate course title found" });
  }
  course.title = title;
  course.desc = desc;

  const updatedCourse = await course.save();
  res.json({ message: "Updated course" });
});

const deleteCourse = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Course ID is required" });
  }

  const course = await Course.findById(id).exec();
  if (!course) {
    return res.status(400).json({ message: "Course not found" });
  }
  const result = await Course.deleteOne();
  const reply = `Course ${result.title} has been deleted`;

  res.json(reply);
});

module.exports = {
  getAllCourses,
  createNewCourse,
  updateCourse,
  deleteCourse,
};
