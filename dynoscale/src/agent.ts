import { DynoscaleConfig } from "./config.js";
import { DynoscaleRepository, ILogRecord } from "./repository.js";
import { DynoscaleClient } from "./client.js";
import { Millis } from "./types.js";
import { ConfigResponse } from "./configResponse.js";

const MAX_RECORD_AGE_MS: Millis = 300_000; // Records older than this will be discarded before each upload
const DEFAULT_PUBLISH_FREQUENCY: Millis = 30_000; // Minimum time between publishing records

/**
 * Agent is responsible for collecting and continually reporting collected log records.
 */
export class DynoscaleAgent {
  private readonly config: DynoscaleConfig;
  private readonly repository: DynoscaleRepository;
  private readonly client: DynoscaleClient;
  private lastPublishAttempt: Millis | null;
  private lastPublishSuccess: Millis | null;
  private _publishFrequency: Millis;

  constructor(config?: DynoscaleConfig) {
    this.config = config || new DynoscaleConfig();
    this.repository = new DynoscaleRepository();
    this.client = new DynoscaleClient(this.config.dynoscaleUrl, this.config.dynoName);
    this._publishFrequency = DEFAULT_PUBLISH_FREQUENCY;
    this.lastPublishAttempt = null;
    this.lastPublishSuccess = null;
  }

  get publishFrequency(): Millis {
    return this._publishFrequency;
  }

  set publishFrequency(millis: Millis) {
    //TODO: Check if we should have published already and publish
    this._publishFrequency = millis;
  }

  addRecord(record: ILogRecord) {
    this.repository.addRecord(record);
  }

  publish() {
    // First prune the records (we don't care for records older than 5 minutes)
    this.repository.deleteRecordsOlderThan(MAX_RECORD_AGE_MS);
    // Then we check if we even have a valid config
    if (!this.config.isValid) {
      // TODO: Log warning
      console.log("WARNING: Can not publish with invalid config.");
      return;
    }
    // Grab all the records left and attempt to publish them
    this.lastPublishAttempt = new Date().getTime();
    const recordsToPublish = this.repository.getAll();
    if (!recordsToPublish) {
      // TODO: Log warning, should still publish if we have for example workers info!
      console.log("WARNING: There are no records to publish.");
      return;
    }
    // publish them
    this.client
      .uploadRecords(recordsToPublish)
      .catch((reason) => {
        console.log("catch.onRejected");
        console.log(reason);
      })
      .then(
        (value: ConfigResponse | void) => {
          console.log("then.onFulfilled");
          console.log(value);
          // in this case it records were successfully published so update lastPublishSuccess
          this.lastPublishSuccess = this.lastPublishAttempt;
          // and delete all published records
          this.repository.deleteRecords(recordsToPublish);
          // If we got back client config update publish frequency
          // FIXME: Implement
        },
        (reason) => {
          console.log("then.onRejected");
          console.log(reason);
        }
      );
  }
}
