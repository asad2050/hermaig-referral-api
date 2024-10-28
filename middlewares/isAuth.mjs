import jwt from 'jsonwebtoken'
function isAuth(req,res,next){
// checks the json web token if its valid and then assigns the user isAuth true,
// this check is for all request after login such as viewing dashboard
const authHeader = req.get('Authorization');
if(!authHeader){
    const error = new Error('Not authenticated');
    error.statuCode = 401;
    throw error;
}
const token = authHeader.split(' ')[1];
let decodedToken;
try{
    decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

} catch(err){
    err.statuCode=500;
    throw err;
}
if(!decodedToken){
    const error = new Error('Not authenticated.');
    error.statuCode = 401;
    throw error;
}

        req.userId= decodedToken.userId;
        req.isAdmin = decodedToken.isAdmin
        next();
}
export default isAuth;