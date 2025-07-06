import mongoose,{model,Schema,Types} from "mongoose"
const eventSchema=new Schema({
    title:{type:String,required:true},
    description:{type:String,required:true},
    start:{type:Date,required:true},
    end:{type:Date,required:true},
    location:{type:String,required:true},
    public_id:{type:String,required:true},
    eventCapacity:{type:Number,required:true},
    url:{type:String,required:true}
},{timestamps:true})

const Event= model("Event",eventSchema)
export default Event