import { isValidUrl } from "./utilities.js";
import * as process from "process";

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
