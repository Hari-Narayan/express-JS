import jwt from "jsonwebtoken";

import User from "../models/user.js";
import configs from "../configs/index.js";
import { UNAUTHORIZED } from "../lang/en/auth.js";
import { USER_NOT_FOUND } from "../lang/en/user.js";
import ResponseHelper from "../helpers/responseHelper.js";

const auth = async (req, res, next) => {
  let token = req.headers.authorization || "";
  token = token ? token.replace("Bearer ", "") : "";

  try {
    const { email = "" } = jwt.verify(token, configs.jwtSecret);
    const user = await User.findOne({ email });

    if (!user) {
      return ResponseHelper.error({
        res,
        code: 401,
        error: UNAUTHORIZED,
        message: USER_NOT_FOUND,
      });
    }

    req.user = user;

    next();
  } catch (error) {
    return ResponseHelper.error({
      res,
      error,
      code: 401,
      message: UNAUTHORIZED,
    });
  }
};

export default auth;
