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
  const expressVersion = packageJson.dependencies.express.toString();

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

      if (expressVersion.includes("4")) {
        // Generate JSON from rootRouter.stack
        const result = CommonHelper.serializeRouterStack(
          rootRouter.stack,
          configs.apiBaseUrl
        );

        console.table(CommonHelper.extractRoutes(result.layers));
      } else {
        console.info(
          `${color.red(
            `You are using Express version ${expressVersion}. So, serializeRouterStack and extractRoutePaths will not support.`
          )}\n${color.white(
            `NOTE: Please use Express version 4.x.x for this feature.`
          )}`
        );
      }
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();
