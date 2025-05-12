import configs from "../config/index.js";
import { SOMETHING_WENT_WRONG } from "../lang/en/common.js";

class ResponseHelper {
  static error = ({
    res,
    error = null,
    statusCode = 500,
    message = SOMETHING_WENT_WRONG,
  }) => {
    const environment = configs.environment;

    return res.status(statusCode).json({
      success: false,
      message: error.message || message,
      ...(environment === "development" && { stack: error.stack }),
    });
  };

  static success = ({ res, data, statusCode = 200, message = "Success" }) => {
    return res.status(statusCode).json({
      data,
      message,
      success: true,
    });
  };
}

export default ResponseHelper;
