import fs from "fs";
import cors from "cors";
import { join } from "path";
import express from "express";
import { color } from "console-log-colors";
import expressFileUpload from "express-fileupload";

import configs from "./src/configs/index.js";
import rootRouter from "./src/routes/index.js";
import CommonHelper from "./src/helpers/Common.js";
import mongooseConnect from "./src/configs/mongooseConnect.js";

const startServer = async () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(expressFileUpload({ createParentPath: true }));
  app.use(express.static(join(process.cwd(), configs.uploadPath)));

  const packageJson = JSON.parse(fs.readFileSync("package.json"));

  try {
    // Wait for MongoDB connection
    await mongooseConnect();

    app.get("/", (req, res) => {
      res.send(`Welcome to the ${packageJson.name} API!`);
    });

    app.use(configs.urlPrefix, rootRouter);

    app.listen(configs.port, () => {
      console.info(`\nServer running on ${color.blue(`${configs.baseUrl}/`)}`);
      console.info(`API Base URL ${color.blue(configs.apiBaseUrl)}`);

      CommonHelper.displayRoutes(packageJson, rootRouter);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();
