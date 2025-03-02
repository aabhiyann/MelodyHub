import { clerkClient } from "@clerk/express";

export const protectRoute = async (req, res, next) => {
if(!req.auth.userId){
     res.status(401).json({message: "Only Admin can access that"});
    return;


}
next();
};

export const requireAdmin = async (req, res, next) => {
    try{
        const currentUser = await clerkClient.users.getUser(req.auth.userId);
        const isAdmin =  process.env.ADMIN_EMAIL === currentUser.primaryEmailAddress?.emailAddress;
        if(!isAdmin){
            res.status(403).json({message: "You must be an admin"});
            return;
        }
        next();
    }
    catch(error){
        res.status(500).json({message: "Authentication failed to check for admin"});
    }};