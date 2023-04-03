import { DynoscaleConfig } from "./config.js";
import { NextFunction, Request, RequestHandler, Response } from "express";

export class DynoscaleMiddleware {
  config: DynoscaleConfig;

  constructor(config?: DynoscaleConfig) {
    this.config = config || new DynoscaleConfig();
    if (!this.config.isValid) {
      throw new Error(`Dynoscale will not start due to invalid config: ${this.config.toString()}`);
    }
  }

  handler: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    console.log(`DynoscaleMiddleware.handler@${new Date().getDate()}`);
    console.log(this.config.toString());
    next();
  };
}
