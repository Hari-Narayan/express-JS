import { compare } from "bcryptjs";

import User from "../models/user.js";
import ResponseHelper from "../helpers/responseHelper.js";
import { SOMETHING_WENT_WRONG } from "../lang/en/common.js";
import { USER_FOUND, USER_NOT_FOUND } from "../lang/en/user.js";
import {
  INCORRECT_PASSWORD,
  PASSWORD_CHANGED_SUCCESS,
} from "../lang/en/auth.js";

export async function myProfile(req, res) {
  try {
    return ResponseHelper.success({
      res,
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

export async function updatePassword(req, res) {
  try {
    const { password, newPassword } = req.body;
    const { _id, password: oldPassword } = req.user;
    const isPassMatched = await compare(password, oldPassword.toString());

    if (!isPassMatched) {
      return ResponseHelper.error({
        res,
        code: 400,
        error: INCORRECT_PASSWORD,
        message: INCORRECT_PASSWORD,
      });
    }

    await User.updateOne(
      { _id: _id.toString() },
      { $set: { password: newPassword } }
    );

    return ResponseHelper.success({
      res,
      message: PASSWORD_CHANGED_SUCCESS,
    });
  } catch (error) {
    return ResponseHelper.error({
      res,
      error,
      message: SOMETHING_WENT_WRONG,
    });
  }
}

export const list = async (req, res) => {
  try {
    const users = await User.find();

    if (users.length === 0) {
      return ResponseHelper.error({
        res,
        code: 404,
        error: USER_NOT_FOUND,
        message: USER_NOT_FOUND,
      });
    }

    return ResponseHelper.success({ res, data: users, message: USER_FOUND });
  } catch (error) {
    console.error(error);

    return ResponseHelper.error({ res, error, message: SOMETHING_WENT_WRONG });
  }
};
