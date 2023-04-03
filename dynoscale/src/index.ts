import { RequestHandler } from "express";
import { DynoscaleConfig } from "./config.js";
import { DynoscaleMiddleware } from "./middleware.js";

export default (config?: DynoscaleConfig): RequestHandler => {
  const middleware = new DynoscaleMiddleware(config);
  return middleware.handler;
};
