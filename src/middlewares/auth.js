import jwt from "jsonwebtoken"
export const isAuthenticated = (req, res, next) => {
    try {
        const token=req.headers.authorization.split(" ")[1];
        // console.log("token",token)
        if(!token){
            return res.status(401).json({success:false,message:"Unauthorized or login session expired please login again"});
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.userId=decoded._id;
        next();

    } catch (error) {
        throw new Error(error);
    }
}
export const isAuthenticatedAdmin=async(req,res,next)=>{
     try {
        const token=req.headers.authorization?.split(" ")[1];
        
        if(!token){
            return res.status(401).json({success:false,message:"Unauthorized or login session expired please login again"});
        }
        // console.log("token",token)
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.isAdmin=decoded.isAdmin;
        next();

    } catch (error) {
        throw new Error(error);
    }
}
