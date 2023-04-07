import { ILogRecord } from "./repository.js";
import { ConfigResponse } from "./configResponse.js";
import { DYNOSCALE_CLIENT_VERSION, logRecordsToCsv } from "./utilities.js";
import got, { CancelableRequest } from "got";

/**
 * Client is responsible for communicating with Dynoscale Backend
 */
export class DynoscaleClient {
  private readonly dynoscaleUrl: string;
  private readonly dynoName: string;
  private readonly version: string;

  constructor(dynoscaleUrl: string, dynoName: string) {
    this.dynoscaleUrl = dynoscaleUrl;
    this.dynoName = dynoName;
    this.version = DYNOSCALE_CLIENT_VERSION;
  }

  async uploadRecords(records: ILogRecord[]): Promise<CancelableRequest<ConfigResponse>> {
    const responsePromise = got.post(this.dynoscaleUrl, {
      headers: {
        "Content-Type": "text/csv",
        "User-Agent": `dynoscale-node;${this.version}`,
        HTTP_X_DYNO: this.dynoName,
      },
      body: logRecordsToCsv(records),
    });
    return responsePromise.json<ConfigResponse>();
  }
}
