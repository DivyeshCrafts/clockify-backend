import mongoose, {Schema} from "mongoose";

const todoSchema = new Schema({
    user_id:{type: Schema.Types.ObjectId, ref:"User", required:true, index:true},
    title: {type: String, required: true, trim:true},
    description: {type: String, default:"", trim:true},
    reminderTime:{type: Date, required:true,},
    dueDate:{type: Date, required:true,},
    is_delete: {type: Boolean, default: false},
    completed:{type: Boolean, default: false},
}, {timestamps:true})

export const Todo = mongoose.model("Todo", todoSchema)