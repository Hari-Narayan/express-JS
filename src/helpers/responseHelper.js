import configs from "../configs/index.js";
import { SOMETHING_WENT_WRONG } from "../lang/en/common.js";

class ResponseHelper {
  static error = ({
    res,
    error = null,
    code = 500,
    message = SOMETHING_WENT_WRONG,
  }) => {
    const environment = configs.environment;

    return res.status(code).json({
      success: false,
      message: error.message || message,
      ...(environment === "development" && { stack: error.stack }),
    });
  };

  static success = ({ res, data = {}, code = 200, message = "Success" }) => {
    return res.status(code).json({
      data,
      message,
      success: true,
    });
  };
}

export default ResponseHelper;
