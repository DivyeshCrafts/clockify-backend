import mongoose from "mongoose";
import { Todo } from "../models/todo.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHendler.js";

// create
const createTodo = asyncHandler(async (req, res)=>{
    const {title, reminderTime, dueDate, description} = req.body
    

    const todo = await Todo.create({title, reminderTime, dueDate, description, user_id:req.user._id})
    const createdTodo = await Todo.findById(todo._id)
    if(!createdTodo){
        throw new ApiError(500, "Something went wrong while creating todo")
    }
    return res.status(201).json(new ApiResponse(200, createdTodo, "Todo created successfully"))
})

// get all
const getTodo = asyncHandler(async (req, res)=>{
    const all_todo = await Todo.find().lean()
    if(!all_todo.length){
        throw new ApiError(404, "Todo not found")
    }
    return res.status(200).json(new ApiResponse(200, all_todo, "Todo list retrieved successfully"))
})

//get by id
const getById = asyncHandler(async (req, res)=>{
    const id = req.params.id
    //validet id
    if(!mongoose.Types.ObjectId.isValid(id)){
        throw new ApiError(400, "Invalid todo id")
    }
    const todo = await Todo.findById(req.params.id).lean()
    if(!todo){
        throw new ApiError(404, "Todo not found")
    }
    return res.status(200).json(new ApiResponse(200, todo, "Todo retrieved successfully"))
})

//update
const updateTodo = asyncHandler(async (req, res)=>{
    const id = req.params.id
    const {title, reminderTime, dueDate, description} = req.body

    //validation id
    if(!mongoose.Types.ObjectId.isValid(id)){
        throw new ApiError(400, "Invalid todo id")
    }

    //update
    const updateTodo = await Todo.findByIdAndUpdate(id, {title, reminderTime, dueDate, description}, 
        {new : true, runValidators:true}).lean()
    if(!updateTodo){
        throw new ApiError(404, "Todo not found")
    }
    return res.status(200).json(new ApiResponse(200, updateTodo, "Todo updated successfully"))

})

//delete
const deleteTodo = asyncHandler(async (req, res)=>{
    const id = req.params.id
    if(!mongoose.Types.ObjectId.isValid(id)){
        throw new ApiError(400, "Invalid todo id")
    }
    const deletedTodo = await Todo.findByIdAndDelete(id).lean()
    if(!deletedTodo){
        throw new ApiError(404, "Todo not found")
    }
    return res.status(200).json(new ApiResponse(200, null, "Todo deleted successfully"))
})

export {createTodo, getTodo, getById, updateTodo, deleteTodo}