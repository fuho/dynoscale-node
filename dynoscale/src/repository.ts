import { MetaData, Metric, Millis, Source } from "./types.js";
import { randomUUID, UUID } from "crypto";

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
  private records: RequestLogRecord[];

  constructor() {
    this.records = [];
  }

  addRecord(logRecord: RequestLogRecord): void {
    this.records.push(logRecord);
  }

  /**
   * Return all currently stored records, ordered by timestamp
   */
  getAll(): RequestLogRecord[] {
    return this.records.sort((a, b) => a.timestamp - b.timestamp);
  }

  deleteRecordsOlderThan(millis: Millis): void {
    this.deleteRecordsBefore(new Date().getTime() - millis);
  }

  deleteRecordsBefore(time: Millis): void {
    const recordsToDelete = this.records.filter((r) => time > r.timestamp);
    this.deleteRecords(recordsToDelete);
  }

  deleteRecords(records: ILogRecord[]): void {
    this.records = this.records.filter((el) => !records.includes(el));
  }
}
