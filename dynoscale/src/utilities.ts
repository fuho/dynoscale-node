import { Request } from "express";
import { ILogRecord } from "./repository.js";
import { stringify } from "csv-stringify/sync";
import * as self from "../package.json";

const PATTERN_URL = new RegExp(
  "^(https?:\\/\\/)?" + // validate protocol
    "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // validate domain name or
    "((\\d{1,3}\\.){3}\\d{1,3}))" + // validate OR ip (v4) address
    "(\\:\\d+)?" + // validate optional port
    "(\\/[-a-z\\d%_.~+]*)*" + // validate path
    "(\\?[;&a-z\\d%_.~+=-]*)?" + // validate query string
    "(\\#[-a-z\\d_]*)?$", // validate fragment locator
  "i"
);

export function isValidUrl(url: string): boolean {
  return !!PATTERN_URL.test(url);
}

const REQUEST_START_KEY = "x-request-start";

export function requestStartFromRequest(req: Request): number {
  return Number.parseInt(<string>req.headers[REQUEST_START_KEY]);
}

export function records_to_csv(records: ILogRecord[]): string {
  return stringify(records, {
    header: false,
    columns: [{ key: "timestamp" }, { key: "metric" }, { key: "source" }, { key: "metadata" }],
  });
}

export const DYNOSCALE_CLIENT_VERSION = self.version;
