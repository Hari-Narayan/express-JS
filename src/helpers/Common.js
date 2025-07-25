import { resolve } from "path";
import jwt from "jsonwebtoken";
import { readFileSync } from "fs";
import { color } from "console-log-colors";

import configs from "../configs/index.js";

export default class CommonHelper {
  /**
   * ### Extract Route Paths
   * Extracts route paths from a router file.
   *
   * @param {string} filePath - Absolute or relative path to the router file.
   * @returns {string[]} - Array of route paths (e.g., ['/auth', '/user']).
   */
  static extractRoutePaths(filePath, urlPrefix) {
    try {
      const absolutePath = resolve(filePath);
      const content = readFileSync(absolutePath, "utf-8");

      const regex = new RegExp(/rootRouter\.use\(\s*["'`]([^"'`]+)["'`]/g);
      const matches = Array.from(content.matchAll(regex));

      console.log("\n========== Route List Start ==========\n");

      matches.forEach((route) => {
        const exactPath = `${urlPrefix}${route[1]}/`;
        console.info(color.blue(exactPath));
      });

      console.log("\n=========== Route List End ===========\n");
    } catch (err) {
      console.error(`Error reading or parsing file: ${err.message}`);
      return [];
    }
  }

  /**
   * ### Random String Generator
   * Generates a random string of specified length.
   *
   * @param {number} length - Length of the random string to generate.
   * @returns {string} - Random string of specified length.
   */
  static randomString(length = 40) {
    let result = "";
    const chars =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for (let i = length; i > 0; --i)
      result += chars[Math.floor(Math.random() * chars.length)];

    return result;
  }

  /**
   * ### Serialize Router Stack
   * Serializes the router stack to a structured format.
   * Note: It will not work with nested routers but in Express 4.x.x.
   * @param {*} stack
   * @param {*} baseUrl
   * @param {*} prefix
   * @returns
   */
  static serializeRouterStack(stack, baseUrl = "", prefix = "") {
    const result = {
      layers: [],
      prefix: prefix || "/",
    };

    if (!stack) {
      console.error("Error: Router stack is not available.");
      return result;
    }

    stack.forEach((layer) => {
      let routePathPrefix = "";

      try {
        const layerData = {};

        if (layer.route) {
          // Direct route (e.g., GET /)
          layerData.type = "route";
          const methods = Object.keys(layer.route.methods).map((method) =>
            method.toUpperCase()
          );

          layerData.methods = methods.join(", ");
          layerData.fullPath = `${baseUrl}${prefix}${
            layer.route.path === "/" && prefix ? "" : layer.route.path
          }`;
          layerData.pathWithoutPrefix = `${prefix}${
            layer.route.path === "/" && prefix ? "" : layer.route.path
          }`;
        } else if (layer.name === "router" && layer.handle?.stack) {
          // Nested router (e.g., /auth, /user)
          const regexStr = layer.regexp?.toString() || "";
          let routeArr = regexStr.match(/\/(\w+)/);
          let routePrefix = routeArr?.[1] ? `/${routeArr[1]}` : "";
          routePathPrefix = routePrefix;
          layerData.type = "router";
          layerData.prefix = routePrefix;
          layerData.stack = this.serializeRouterStack(
            layer.handle.stack,
            baseUrl,
            routePrefix
          ).layers;
        } else if (layer.handle) {
          // Middleware (e.g., auth)
          layerData.type = "middleware";
          layerData.middleware = layer.handle.name || "anonymous";
        } else {
          layerData.type = "unknown";
        }

        result.layers.push(layerData);
      } catch (err) {
        console.error(`Error processing layer: ${err.message}`);
      }
    });

    return result;
  }

  static extractRoutes(layers = []) {
    let routes = [];

    layers.forEach((layer) => {
      if (layer.stack) {
        layer.stack.forEach((subLayer) => {
          if (subLayer.pathWithoutPrefix) {
            routes.push({
              METHODS: subLayer.methods,
              ROUTE: subLayer.pathWithoutPrefix,
            });
          }
        });
      } else if (layer.pathWithoutPrefix) {
        routes.push({
          METHODS: layer.methods,
          ROUTE: layer.pathWithoutPrefix,
        });
      }
    });

    return routes;
  }

  /**
   * ### Generate JWT Token
   * @param email - The email address to be encoded in the token.
   * @description Generates a JWT token for the given email address.
   * The token is signed using a secret key and has an expiration time of 24 hours.
   * @returns - The generated JWT token.
   */
  static generateToken = (email) => {
    const token = jwt.sign({ email }, configs.jwtSecret, {
      expiresIn: "24h",
    });

    return token;
  };

  /**
   * ### Display Routes
   * @param packageJson - Package json data
   * @param rootRouter - Root route stack
   */
  static displayRoutes = (packageJson, rootRouter) => {
    try {
      const expressVersion = packageJson.dependencies.express.toString();

      if (expressVersion.includes("4.")) {
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
          )}`
        );
        console.info(
          "NOTE: Please use Express version 4.x.x for this feature."
        );
      }
    } catch (error) {
      console.error(color.red(`❌ Error: ${error}`));
    }
  };
}
