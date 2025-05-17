import jwt from "jsonwebtoken";

import User from "../models/user.js";
import configs from "../configs/index.js";
import ResponseHelper from "../helpers/Response.js";
import { USER_NOT_FOUND } from "../lang/en/user.js";
import { TOKEN_EXPIRED, TOKEN_NOT_FOUND } from "../lang/en/auth.js";

const auth = async (req, res, next) => {
  let token = req.headers.authorization || "";
  token = token ? token.replace("Bearer ", "") : "";

  try {
    if (!token) {
      return ResponseHelper.error({
        res,
        error,
        code: 401,
        message: TOKEN_NOT_FOUND,
      });
    }

    const { email = "" } = jwt.verify(token, configs.jwtSecret);
    const user = await User.findOne({ email });

    if (!user) {
      return ResponseHelper.error({
        res,
        code: 401,
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
      message: TOKEN_EXPIRED,
    });
  }
};

export default auth;
