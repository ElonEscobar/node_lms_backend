const User = require("../models/User");
const Course = require("../models/Course");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").lean();
  if (!users?.length) {
    return res.status(400).json({ message: "No users found" });
  }
  res.json(users);
});

const createNewUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const duplicate = await User.findOne({ email }).lean().exec();
  if (duplicate) {
    return res.status(409).json({ message: "Duplicate email" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const userObj = {
    firstName,
    lastName,
    email,
    password: hashedPassword,
    roles: "Student",
  };

  const user = await User.create(userObj);
  if (user) {
    res.status(201).json({ message: `New user ${firstName} created!` });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const { id, firstName, lastName, password, email } = req.body;

  if (!id || !firstName || !lastName || !email) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  // check duplicate
  const duplicate = await User.findOne({ email }).lean().exec();
  // allow updates to the original user
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate email" });
  }
  user.firstName = firstName;
  user.lastName = lastName;
  user.email = email;

  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }

  const updatedUser = await user.save();
  res.json({ message: "Updated user" });
});

// DELETE
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "User Id is required" });
  }

  const user = await User.findById(id).exec();
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }
  const result = await User.deleteOne();
  const reply = `Username ${result.firstName} has been deleted`;

  res.json(reply);
});

// enroll user to a course
const enrollUser = asyncHandler(async (req, res) => {
  try {
    const { courseId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      res.status(404).json({ message: "Invalid course id" });
    }

    const course = await Course.findById(courseId).exec();
    if (!course) {
      res.status(404).json({ message: "course does not exist" });
    }

    // get user
    const userEmail = req.user;
    const user = await User.findOne({ userEmail });

    if (user.enrolledCourses.includes(course._id)) {
      res.status(400).json({ message: "You already enrolled in this course" });
    }
    user.enrolledCourses.push(course._id);
    await user.save();

    res.status(200).json({ message: "Enrolled successfully" });
    
  } catch (error) {
    res.status(401).json({ message: "error enrolling" });
  }
});

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
  enrollUser,
};
