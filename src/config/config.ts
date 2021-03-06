import dotenv from "dotenv";
import path from "path";
import { EnvVars } from "../validations/env.validation";

// TODO: properly load env file
if (process.env.NODE_ENV == "development") {
  dotenv.config({ path: path.join(__dirname, `../../.env.development`) });
} else if (process.env.NODE_ENV == "test") {
  dotenv.config({ path: path.join(__dirname, `../../.env.test`) });
}
const validationResult = EnvVars.safeParse(process.env);

if (!validationResult.success) {
  throw new Error(
    `Invalid ENV configuration: ${JSON.stringify(
      validationResult.error.issues
    )}`
  );
}

const config = validationResult.data;
export default config;
