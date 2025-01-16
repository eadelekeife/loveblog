const jwt = require("jsonwebtoken");
// const Organization = require("../models/Organization");
const Users = require("../models/userModel");
const apiResponse = require("../utils/apiResponse");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      console.log("Decoded Token:", decoded);

      req.user = await Users.findById(decoded.userId).select("-password");

      console.log("Found User/Organization:", req.user);

      if (!req.user) {
        return res.json(apiResponse({
          success: false,
          status: 404,
          message: "User not found",
          error: ""
        }))
      }
      next();
    } catch (err) {
      console.error("Error during token validation:", err.message);
      return res.json(apiResponse({
        success: false,
        status: 401,
        message: "Token not valid",
        error: ""
      }))
    }
  } else {
    return res.json(apiResponse({
      success: false,
      status: 401,
      message: "Token not provided",
      error: ""
    }))
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.accountType)) {
      return res.status(403).json({
        message: `User type ${req.user.accountType} is not authorized to access this resource`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
