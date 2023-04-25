import fetch from "node-fetch";
import { ILogRecord } from "./repository.js";
import { ConfigResponse } from "./configResponse.js";
import { stringify } from "csv-stringify/sync";
import { DYNOSCALE_CLIENT_VERSION } from "./constants.js";

export function logRecordsToCsv(records: ILogRecord[]): string {
  const forExport = records.map((r) => [Math.floor(r.timestamp / 1_000), r.metric, r.source, r.metadata]);
  return stringify(forExport, { header: false });
}

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

  async uploadRecords(records: ILogRecord[]) {
    const responsePromise = fetch(this.dynoscaleUrl, {
      method: "post",
      body: logRecordsToCsv(records),
      headers: {
        "Content-Type": "text/csv",
        "User-Agent": `dynoscale-node;${this.version}`,
        HTTP_X_DYNO: this.dynoName,
      },
    }).then<ConfigResponse, void>(
      (response) => response.json(),
      (reason) => {
        console.log("Error uploading records. Reason:" + `${reason}`);
      }
    );
    return responsePromise;
  }
}
