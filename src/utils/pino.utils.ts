import path from "path";
import * as pino from "pino";

const pinoConfig = {
  name: "SOCIO",
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  prettyPrint: process.env.NODE_ENV !== "production",
  timestamp: pino.stdTimeFunctions.isoTime
};

const logfile = path.join(__dirname, "../../logs/logfile.txt");

const pinoDestination = process.env.NODE_ENV !== "production" ? {} : { dest: logfile, sync: false };
export const logger = pino.default({ ...pinoConfig }, pino.destination({ ...pinoDestination }));
