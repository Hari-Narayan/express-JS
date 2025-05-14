import moment from "moment";
import { genSaltSync, hashSync } from "bcryptjs";

import configs from "../configs/index.js";

export const setJson = {
  getters: true,
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.password;

    ret.createdAt = moment(ret.createdAt).format(configs.dateFormat);
    ret.updatedAt = moment(ret.updatedAt).format(configs.dateFormat);
  },
};

export function encryptPassword(password) {
  const salt = genSaltSync(10);
  const hash = hashSync(password, salt);

  return hash;
}
