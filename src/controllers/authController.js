import { compareSync } from "bcryptjs";

import User from "../models/user.js";
import configs from "../configs/index.js";
import mailer from "../helpers/mailerHelper.js";
import { USER_NOT_FOUND } from "../lang/en/user.js";
import CommonHelper from "../helpers/commonHelper.js";
import ResetPassword from "../models/resetPassword.js";
import ResponseHelper from "../helpers/responseHelper.js";
import {
  LOGIN_SUCCESS,
  TOKEN_NOT_FOUND,
  INCORRECT_PASSWORD,
  USER_ALREADY_EXIST,
  RESET_LINK_EXPIRED,
  RESET_LINK_SENT_SUCCESS,
  PASSWORD_CHANGED_SUCCESS,
} from "../lang/en/auth.js";

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });

    if (!user)
      return ResponseHelper.error({
        res,
        code: 404,
        error: USER_NOT_FOUND,
        message: USER_NOT_FOUND,
      });

    const isPassMatched = compareSync(password, user.password);

    if (!isPassMatched)
      return ResponseHelper.error({
        res,
        code: 400,
        error: INCORRECT_PASSWORD,
        message: INCORRECT_PASSWORD,
      });

    user.token = CommonHelper.generateToken(user.email);

    return ResponseHelper.success({
      res,
      data: user,
      code: 200,
      msg: LOGIN_SUCCESS,
    });
  } catch (error) {
    return ResponseHelper.error({
      res,
      error,
    });
  }
}

export async function register(req, res) {
  try {
    let user = await User.findOne({ email: req.body.email });

    if (user)
      return ResponseHelper.error({
        res,
        code: 400,
        error: USER_ALREADY_EXIST,
        message: USER_ALREADY_EXIST,
      });

    user = await new User(req.body).save();

    user.token = CommonHelper.generateToken(user.email);

    return ResponseHelper.success({
      res,
      data: user,
      code: 201,
      message: LOGIN_SUCCESS,
    });
  } catch (error) {
    return ResponseHelper.error({
      res,
      error,
    });
  }
}

export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return ResponseHelper.error({
        res,
        code: 404,
        error: USER_NOT_FOUND,
        message: USER_NOT_FOUND,
      });

    await ResetPassword.findOneAndDelete({ email });

    let resetUser = await new ResetPassword({
      email,
      token: CommonHelper.randomString(60),
      expiredAt: new Date().getTime() + 1000 * 60 * 60,
    }).save();

    await mailer({
      to: email,
      subject: "Reset Password",
      html: `<a href="${configs.resetLink.replace(
        "token",
        resetUser.token
      )}" target="_blank">Click here to reset password</a>`,
    });

    return ResponseHelper.success({
      res,
      message: RESET_LINK_SENT_SUCCESS,
    });
  } catch (error) {
    return ResponseHelper.error({
      res,
      error,
    });
  }
}

export async function resetPassword(req, res) {
  try {
    const { token, password } = req.body;
    const resetPassword = await ResetPassword.findOne({ token });

    if (!resetPassword)
      return ResponseHelper.error({
        res,
        code: 404,
        error: TOKEN_NOT_FOUND,
        message: TOKEN_NOT_FOUND,
      });

    const { email, expiredAt } = resetPassword;
    const now = new Date().getTime();

    if (now > expiredAt)
      return ResponseHelper.error({
        code: 400,
        message: RESET_LINK_EXPIRED,
      });

    await User.findOneAndUpdate(
      { email },
      { $set: { password } },
      { new: true }
    );

    await ResetPassword.deleteOne({ token });

    return ResponseHelper.success({
      res,
      message: PASSWORD_CHANGED_SUCCESS,
    });
  } catch (error) {
    return ResponseHelper.error({
      res,
      error,
    });
  }
}
