import { configDotenv } from "dotenv";
import { expand } from "dotenv-expand";

expand(configDotenv());

const configs = {
  dateFormat: "DD MMM, YYYY HH:mm:ss",
  baseUrl: process.env.BASE_URL || "",
  mailHost: process.env.MAIL_HOST || "",
  mailPort: process.env.MAIL_PORT || "",
  mailUser: process.env.MAIL_USER || "",
  port: Number(process.env.PORT) || 3000,
  resetLink: process.env.RESET_URL || "",
  mongoUri: process.env.MONGODB_URI || "",
  apiBaseUrl: process.env.API_BASE_URL || "",
  urlPrefix: process.env.URL_PREFIX || "/api",
  mailPassword: process.env.MAIL_PASSWORD || "",
  jwtSecret: process.env.JWT_SECRET || "jwt_secret",
  environment: process.env.NODE_ENV || "development",
  uploadPath: process.env.UPLOAD_PATH || "/public/uploads/",
};

export default configs;
