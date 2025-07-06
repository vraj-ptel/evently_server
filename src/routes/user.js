import express from "express"
import { adminLogin, getUserDetail, isAdminVerified, login, register, validUserOrNot } from "../controllers/user.js";
import { isAuthenticated, isAuthenticatedAdmin } from "../middlewares/auth.js";

const app=express.Router();
app.post('/register',register)
app.post('/login',login)
app.post('/admin/verify',adminLogin)
app.get('/detail',isAuthenticated,getUserDetail)

// this end point is only for verifing either user has valid jwt token or not and save query to db
app.get('/verify',isAuthenticated,validUserOrNot)
app.get('/admin/verify',isAuthenticatedAdmin,isAdminVerified)
export default app;