import parseArgs from "minimist";
import * as dotenv from "dotenv";

dotenv.config();

const args = parseArgs(process.argv.slice(2));

const PORT = args.PORT || process.env.PORT || 8080;
const MONGOPSW = process.env.MONGOATLAS;

export { PORT, MONGOPSW };
