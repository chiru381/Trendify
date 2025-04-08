import winston from "winston";
import "winston-mongodb";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

export { logger };
