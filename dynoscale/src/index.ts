import { NextFunction, Request, RequestHandler, Response } from "express";
import * as process from "process";
import { isValidUrl } from "./utilities.js";

export const Greeter = (name: string) => `👋 Hello, ${name}!`;

export enum RunMode {
  Production = "production",
  Development = "development",
}

type DynoName = string;
type DynoscaleUrl = string;

export class DynoscaleConfig {
  dynoName: DynoName;
  dynoscaleUrl: DynoscaleUrl;
  runMode: RunMode;

  public toString = (): string =>
    "DynoscaleConfig(" +
    JSON.stringify({
      dynoscaleUrl: this.dynoscaleUrl,
      dynoName: this.dynoName,
      runMode: this.runMode,
    }) +
    ")";

  get isValid(): boolean {
    return this.dynoName === "web.1" && isValidUrl(this.dynoscaleUrl);
  }

  constructor() {
    // set it up from env
    this.dynoscaleUrl = process.env.DYNOSCALE_URL || "";
    this.runMode = process.env.DYNOSCALE_DEV_MODE !== undefined ? RunMode.Development : RunMode.Production;
    this.dynoName = process.env.DYNO || "";
  }
}

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
    console.log(this.config);
    next();
  };
}

export default (config?: DynoscaleConfig): RequestHandler => {
  const middleware = new DynoscaleMiddleware(config);
  return middleware.handler;
};
