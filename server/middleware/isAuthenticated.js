require("dotenv").config();
const jwt = require("jsonwebtoken");
const { SECRET } = process.env;

module.exports = {
  isAuthenticated: (req, res, next) => { //will be used on every function that needs authentication
    const headerToken = req.get("Authorization");
    console.log(headerToken)

    if (!headerToken) { 
      console.log("ERROR IN auth middleware");
      res.sendStatus(401);//error 401 is an unauthorized error and 500 is generic error in that the server encounted an unexpected condition and could finish the request
    }// next or send will allow the req to contiue 

    let token;

    try {
      token = jwt.verify(headerToken, SECRET); // if token is verifed then its authenticated and 
    } catch (err) {
      err.statusCode = 500;
      throw err;
    }

    if (!token) { //if the token doesnt match then the user is not authenticated
      const error = new Error("Not authenticated.");
      error.statusCode = 401;
      throw error;
    }

    next(); //allows the request to continue to the next middleware, if it's not called the req cant continue its journey,  
  },
};
