import mongoose from "mongoose";
import { color } from "console-log-colors";

import configs from "./index.js";
import { DB_CONNECTED } from "../lang/en/common.js";

const mongooseConnect = async () => {
  try {
    await mongoose.connect(configs.mongoUri);
    console.log(`\n${color.green(DB_CONNECTED)}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

export default mongooseConnect;
