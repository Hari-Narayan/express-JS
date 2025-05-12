import mongoose from "mongoose";

import configs from "./index.js";

const mongooseConnect = async () => {
  try {
    await mongoose.connect(configs.mongoUri);
    console.log(`Database connected successfully.`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

export default mongooseConnect;
