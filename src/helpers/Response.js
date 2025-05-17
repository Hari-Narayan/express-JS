import configs from "../configs/index.js";
import { SOMETHING_WENT_WRONG, SUCCESS } from "../lang/en/common.js";

class ResponseHelper {
  static error = ({ res, error = null, code = 500, message = "" }) => {
    const environment = configs.environment;
    message = message || error?.message || SOMETHING_WENT_WRONG;

    return res.status(code).json({
      message,
      success: false,
      ...(environment === "development" && { stack: error.stack }),
    });
  };

  static success = ({ res, data = {}, code = 200, message = SUCCESS }) => {
    return res.status(code).json({
      data,
      message,
      success: true,
    });
  };
}

export default ResponseHelper;
