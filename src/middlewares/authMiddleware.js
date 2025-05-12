import jwt from "jsonwebtoken";

import User from "../models/user.js";
import configs from "../config/index.js";
import { UNAUTHORIZED } from "../lang/en/auth.js";
import ResponseHelper from "../helpers/responseHelper.js";

const auth = async (req, res, next) => {
  let token = req.headers.authorization || "";
  token = token ? token.replace("Bearer ", "") : "";

  try {
    const { email = "" } = jwt.verify(token, configs.jwtSecret);
    const user = await User.findOne({ email });
    req.user = user;

    return next();
  } catch (error) {
    return ResponseHelper.error({
      res,
      error,
      statusCode: 401,
      message: UNAUTHORIZED,
    });
  }
};

export default auth;
