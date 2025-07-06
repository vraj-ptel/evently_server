import express from "express"
import { singleUpload } from "../middlewares/multer.js";
import { createEvent, eventDetailsForAdmin, getBookedEvent, getEvents, registerEvent,unregisterEvent } from "../controllers/event.js";
import { isAuthenticated, isAuthenticatedAdmin } from "../middlewares/auth.js";
const app=express.Router();
// app.post('/',singleUpload,createEvent)
app.get('/',getEvents);
app.get('/booked',isAuthenticated,getBookedEvent)
app.get('/admin/events',isAuthenticatedAdmin,eventDetailsForAdmin)
app.post('/register',isAuthenticated,registerEvent)
app.post('/unregister',isAuthenticated,unregisterEvent)
app.post('/create',isAuthenticatedAdmin,singleUpload,createEvent)
export default app