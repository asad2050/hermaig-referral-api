import jwt from 'jsonwebtoken'
function isAuth(req,res,next){
// checks the json web token if its valid and then assigns the user isAuth true,
// this check is for all request after login such as viewing dashboard

let decodedToken;
try{
    const authHeader = req.get('Authorization');

    if(!authHeader){
        const error = new Error('Not authenticated');
        error.statuCode = 401;
        throw error;
    }
    const token = authHeader.split(' ')[1];

    decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if(!decodedToken){
        const error = new Error('Not authenticated.');
        error.statuCode = 401;
        throw error;
    }

} catch(err){
    err.statuCode=500;
    throw err;
}


        req.userId= decodedToken.userId;
        req.role= decodedToken.role;
        req.isAdmin = decodedToken.isAdmin;
        next();
}
export default isAuth;