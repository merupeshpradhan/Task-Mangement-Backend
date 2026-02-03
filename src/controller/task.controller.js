import { Task } from "../models/task.schema.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createTask = asyncHandler(async (req, res) => {
  const { title, description, assignedTo } = req.body;

  if (!title || !description || !assignedTo) {
    throw new ApiError(400, "All fields are required");
  }

  const task = await Task.create({
    title,
    description,
    assignedTo,
    createdBy: req.user._id,
  });

  const populatedTask = await Task.findById(task._id)
    .populate("createdBy", "fullName email")
    .populate("assignedTo", "fullName email");

  res.status(201).json(new ApiResponse(201, populatedTask));
});

export const getAllTasks = async (req, res) => {
  const tasks = await Task.find()
    .populate("createdBy", "fullName email")
    .populate("assignedTo", "fullName email");

  res.status(200).json({
    success: true,
    data: tasks,
  });
};

export const getMyTasks = async (req, res) => {
  const tasks = await Task.find({ assignedTo: req.user.id })
    .populate("createdBy", "fullName email")
    .populate("assignedTo", "fullName email");

  res.status(200).json({
    success: true,
    data: tasks,
  });
};

export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) throw new ApiError(404, "Task not found");

  if (req.user.role === "admin") {
    Object.assign(task, req.body);
  } else {
    if (task.assignedTo.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "Not allowed");
    }
    task.status = req.body.status;
  }

  await task.save();

  const populatedTask = await Task.findById(task._id)
    .populate("createdBy", "fullName email")
    .populate("assignedTo", "fullName email");

  res.status(200).json(new ApiResponse(200, populatedTask));
});

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) throw new ApiError(404, "Task not found");

  await task.deleteOne();
  res.status(200).json(new ApiResponse(200, {}));
});
