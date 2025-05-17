import { compare } from "bcryptjs";

import User from "../models/user.js";
import ResponseHelper from "../helpers/Response.js";
import FileUploadHelper from "../helpers/FileUpload.js";
import { PASSWORD_CHANGED, INCORRECT_PASSWORD } from "../lang/en/auth.js";
import { IMAGE_UPLOADED, USER_FOUND, USER_NOT_FOUND } from "../lang/en/user.js";

export async function myProfile(req, res) {
  try {
    return ResponseHelper.success({
      res,
      data: req.user,
      message: USER_FOUND,
    });
  } catch (error) {
    return ResponseHelper.error({ res, error });
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
        message: INCORRECT_PASSWORD,
      });
    }

    await User.updateOne(
      { _id: _id.toString() },
      { $set: { password: newPassword } }
    );

    return ResponseHelper.success({
      res,
      message: PASSWORD_CHANGED,
    });
  } catch (error) {
    return ResponseHelper.error({ res, error });
  }
}

export const list = async (req, res) => {
  try {
    const users = await User.find();

    if (users.length === 0) {
      return ResponseHelper.error({
        res,
        code: 404,
        message: USER_NOT_FOUND,
      });
    }

    return ResponseHelper.success({ res, data: users, message: USER_FOUND });
  } catch (error) {
    return ResponseHelper.error({ res, error });
  }
};

export const uploadImage = async (req, res) => {
  try {
    FileUploadHelper.singleFileUpload(req, "profileImage", "users");

    const { profileImage } = req.body;
    const { profileImage: oldProfileImage, _id } = req.user;

    FileUploadHelper.removeSingleFile(oldProfileImage);

    const user = await User.findByIdAndUpdate(
      { _id },
      { $set: { profileImage } },
      { new: true }
    );

    return ResponseHelper.success({ res, data: user, message: IMAGE_UPLOADED });
  } catch (error) {
    return ResponseHelper.error({ res, error });
  }
};
