import { compare } from "bcryptjs";

import User from "../models/user.js";
import ResponseHelper from "../helpers/responseHelper.js";
import { USER_FOUND, USER_NOT_FOUND } from "../lang/en/user.js";
import {
  INCORRECT_PASSWORD,
  PASSWORD_CHANGED_SUCCESS,
} from "../lang/en/auth.js";

export async function myProfile(req, res) {
  try {
    return ResponseHelper.success({
      data: req.user,
      message: USER_FOUND,
    });
  } catch (error) {
    return ResponseHelper.error({
      res,
      error,
    });
  }
}

export async function changePassword(req, res) {
  try {
    const { email, password, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return ResponseHelper.error({
        res,
        statusCode: 404,
        error: USER_NOT_FOUND,
        message: USER_NOT_FOUND,
      });
    }

    const isPassMatched = compare(password, user.password);

    if (!isPassMatched) {
      return ResponseHelper.error({
        statusCode: 400,
        error: INCORRECT_PASSWORD,
        message: INCORRECT_PASSWORD,
      });
    }

    await User.findOneAndUpdate(
      { _id: user.id },
      { $set: { password: newPassword } },
      { new: true }
    );

    return ResponseHelper.success({
      msg: PASSWORD_CHANGED_SUCCESS,
    });
  } catch (error) {
    return ResponseHelper.error({
      res,
      error,
    });
  }
}
