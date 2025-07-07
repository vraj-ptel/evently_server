import Event from "../models/eventModel.js";
import customError from "../utils/errorClass.js";
import User from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";
import { v4 as uuid } from "uuid";
import Book from "../models/bookModel.js";
import { sendGmail } from "../utils/sendEmail.js";
const getBase64 = (file) => {
    return `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
}

export const createEvent=async(req,res,next)=>{
    try {
        
        const {title,description,start,end,location,eventCapacity}=req.body;
        
        const file=req.file;
        if(!title || !description || !start || !end ||!location){
            return next(new customError("All fields are required",400));
        }
        if(!file){
            return next(new customError("Image is required",400));
        }
        if(new Date(start)>new Date(end)){
            return next(new customError("Start date must be less than end date",400));
        }
        const upload=await cloudinary.uploader.upload(getBase64(file),{
            resource_type:'auto',
            public_id:uuid()
        })
        const url={url:upload.url,public_id:upload.public_id}
       

        const event=await Event.create({title,description,start,end,public_id:url.public_id,url:url.url,location,eventCapacity:parseInt(eventCapacity)});
        res.status(201).json({success:true,event})
    } catch (error) {
        return next(new customError(error.message || "error creating event",500));
    }
}

export const getEvents=async(req,res,next)=>{
    try {
        const events=await Event.find({start:{$gt:new Date()}});
         const bookingData = await Book.find({});
        const data = events.map((event) => {
            const bookingCount = bookingData.filter(
                (book) => book.eventId.toString() === event._id.toString()
            ).length;
            const eventObj = event.toObject();
            return {
                ...eventObj,
                seatRegistered: bookingCount,
                seatLeft: event.eventCapacity - bookingCount,
                percentage:
                    event.eventCapacity > 0
                        ? (bookingCount / event.eventCapacity) * 100
                        : 0,
            };
        });
       
        res.status(200).json({success:true,events:data})
    } catch (error) {
        return next(new customError(error.message || "error getting events",500));
    }
}

export const registerEvent=async(req,res,next)=>{
    try {
        const userId=req?.userId;
        if(!userId){
            return next(new customError("User not found",404));
        } 
        const user=await User.findById(userId);
        if(!user){
            return next(new customError("User not found",404));
        }
        const {eventId,name,email}=req.body;
        if(!eventId){
            return next(new customError("Event id is required",400));
        }
        const event=await Event.findById(eventId);
        
        if(!event){
            return next(new customError("Event not found",404));
        }
        if(!name || !email){
            return next(new customError('All fields are required',400));
        }
        const isBooked=await Book.findOne({eventId:event._id,bookedBy:userId});
        if(isBooked){
            return next(new customError("You have already registered for this event",400));
        }
        const book =await Book.create({name,email,bookedBy:userId,eventId:event._id});

        const confirmMail=await sendGmail({name,email,event})
        
        res.status(200).json({success:true,message:`You have successfully registered for ${event.title}`})
    } catch (error) {
        return next(new customError(error.message || "error registering event",500));
    }
}

export const unregisterEvent=async(req,res,next)=>{
    try {
        const userId=req.userId;
        if(!userId){
            return next(new customError("User not found",404));
        } 
        const {eventId}=req.body;
        const event=await Event.findById(eventId);
        if(!event){
            return next(new customError("Event not found",404));
        }
        const book=await Book.findOneAndDelete({eventId:event._id,bookedBy:userId});
        if(!book){
            return next(new customError("This event is not found or might have already been unregistered",400));
        }
        res.status(200).json({success:true,message:`You have successfully unregistered for ${event.title}`})
    } catch (error) {
        return next(new customError(error.message || "error unregistering event",500));
    }
}


export const getBookedEvent=async(req,res,next)=>{
    try {
        const userId=req.userId;
        if(!userId){
            return next(new customError("User not found",404));
        } 
        const books=await Book.find({bookedBy:userId}).populate("eventId");
        const events=books.map((book)=>{
            return {
                name:book.name,
                email:book.email,
                _id:book.eventId._id,
                event:book.eventId
            }
        })
        
        res.status(200).json({success:true,events})
    } catch (error) {
        return next(new customError(error.message || "error getting events",500));
    }
}

export const eventDetailsForAdmin = async (req, res, next) => {
    try {
        const isAdmin = req.isAdmin;
        if (!isAdmin) {
            return next(new customError("Admin not authenticated", 404));
        }
        const events = await Event.find({});
        const bookingData = await Book.find({});
        const data = events.map((event) => {
            const bookingCount = bookingData.filter(
                (book) => book.eventId.toString() === event._id.toString()
            ).length;
            const eventObj = event.toObject();
            return {
                ...eventObj,
                seatRegistered: bookingCount,
                seatLeft: event.eventCapacity - bookingCount,
                percentage:
                    event.eventCapacity > 0
                        ? (bookingCount / event.eventCapacity) * 100
                        : 0,
            };
        });

        res.status(200).json({ success: true, events: data });
    } catch (error) {
        return next(
            new customError(error.message || "error getting events", 500)
        );
    }
};