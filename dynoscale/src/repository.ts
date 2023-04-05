import { DynoscaleConfig } from "./config.js";
import { MetaData, Metric, Millis, Source } from "./types.js";

export interface ILogRecord {
  readonly timestamp: Millis;
  readonly metric: Metric;
  readonly source: Source;
  readonly metadata: MetaData;
}

export class RequestLogRecord implements ILogRecord {
  timestamp: Millis;
  metric: Metric;
  source: string;
  metadata: string;

  constructor(timestamp: Millis, queueTime: Metric) {
    this.timestamp = timestamp;
    this.metric = queueTime;
    this.source = "web";
    this.metadata = "";
  }
}

export class DynoscaleRepository {
  private config: DynoscaleConfig;
  private records: RequestLogRecord[];

  constructor(config?: DynoscaleConfig) {
    this.config = config || new DynoscaleConfig();
    this.records = [];
  }

  addRecord(logRecord: RequestLogRecord): void {
    this.records.push(logRecord);
  }

  getAll(): RequestLogRecord[] {
    return this.records;
  }

  deleteRecordsOlderThan(time: Millis): void {
    this.deleteRecordsBefore(new Date().getDate() - time);
  }

  deleteRecordsBefore(timestamp: Millis): void {
    this.deleteRecords(this.records.filter((record) => record.timestamp < timestamp));
  }

  deleteRecords(records: ILogRecord[]): void {
    this.records = this.records.filter((el) => !records.includes(el));
  }
}
