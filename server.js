import fs from "fs";
import express, { json } from "express";
import { color } from "console-log-colors";

import configs from "./src/configs/index.js";
import rootRouter from "./src/routes/index.js";
import CommonHelper from "./src/helpers/commonHelper.js";
import mongooseConnect from "./src/configs/mongooseConnect.js";

const startServer = async () => {
  const app = express();
  app.use(json());

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
