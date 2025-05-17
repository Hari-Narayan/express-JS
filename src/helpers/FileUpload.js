import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import { existsSync, unlinkSync } from "fs";

import configs from "../configs/index.js";
import { FILE_NOT_FOUND } from "../lang/en/common.js";

export default class FileUploadHelper {
  static singleFileUpload(req, key, folder) {
    try {
      if (!req.files || !req.files[key]) throw new Error(FILE_NOT_FOUND);

      const file = req.files[key];
      const fileName = `${uuidv4()}.${file.name.split(".").pop()}`;
      file.mv(`.${configs.uploadPath}${folder}/${fileName}`);

      req.body[key] = fileName;
    } catch (error) {
      throw error;
    }
  }

  static removeSingleFile(filePath) {
    try {
      if (!filePath) return;

      const [, oldFile] = filePath.split(configs.baseUrl);
      const oldFilePath = join(process.cwd(), configs.uploadPath, oldFile);

      if (!existsSync(oldFilePath)) return;

      unlinkSync(oldFilePath);
    } catch (error) {
      throw error;
    }
  }
}
