

function protectRoutes(req,res,next){
    // extract the role from the req.header and authorization header using jwt and
    // then use the extracted role and compare the role to the authorization role.
    //if not then throw error with not authorized message.
    
    
    if(req.baseUrl.startsWith('/api/admin') && !req.isAdmin){
       const error = new Error('Not authorized.');
       error.statuCode = 403;
       throw error;
     }
     if(req.baseUrl.startsWith('api/referral') && !req.role.includes('user')){
      const error = new Error('Not authorized.');
      error.statuCode = 403;
      throw error;
    }
    next();
    }
    
export default protectRoutes;