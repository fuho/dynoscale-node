import { DynoscaleConfig } from "./config.js";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { RequestLogRecord } from "./repository.js";
import { requestStartFromRequest } from "./utilities.js";
import { DynoscaleAgent } from "./agent.js";

export class DynoscaleMiddleware {
  config: DynoscaleConfig;
  private readonly loggingEnabled: boolean;
  private agent: DynoscaleAgent;

  constructor(config?: DynoscaleConfig) {
    this.config = config || new DynoscaleConfig();
    this.loggingEnabled = true;
    this.agent = new DynoscaleAgent(config);

    console.log(this.config.toString());

    if (!this.config.isValid) {
      this.loggingEnabled = false;
      // FIXME: Do not crash here, log error and continue
      throw new Error(`Dynoscale will not start due to invalid config: ${this.config.toString()}`);
    }
  }

  handler: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    console.log(`DynoscaleMiddleware.handler@${new Date().getDate()}`);
    this.loggingEnabled ? this.logRequestQueueTime(req, res, next) : next();
  };

  private logRequestQueueTime(req: Request, res: Response, next: NextFunction) {
    const nowMs = Date.now();
    const requestQueueTime = Math.ceil(nowMs - requestStartFromRequest(req));
    this.agent.addRecord(new RequestLogRecord(nowMs, requestQueueTime));
  }
}
