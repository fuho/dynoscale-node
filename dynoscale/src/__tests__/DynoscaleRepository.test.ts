import { DynoscaleRepository, RequestLogRecord } from "../repository.js";

describe("DynoscaleRepository", () => {
  describe("that is empty", () => {
    it("should initialize without an issue", () => {
      expect(() => new DynoscaleRepository()).not.toThrow();
    });

    it("should initialize empty", () => {
      const repo = new DynoscaleRepository();
      expect(repo.getAll()).toEqual([]);
    });

    it("deleteRecordsOlderThan should handle all kinds of input", () => {
      const repo = new DynoscaleRepository();
      expect(repo.getAll()).toEqual([]);
      expect(() => repo.deleteRecordsOlderThan(0)).not.toThrow();
      expect(() => repo.deleteRecordsOlderThan(1)).not.toThrow();
      expect(() => repo.deleteRecordsOlderThan(-1)).not.toThrow();
      expect(() => repo.deleteRecordsOlderThan(NaN)).not.toThrow();
      expect(() => repo.deleteRecordsOlderThan(Infinity)).not.toThrow();
      expect(() => repo.deleteRecordsOlderThan(-Infinity)).not.toThrow();
      expect(() => repo.deleteRecordsOlderThan(new Date().getTime())).not.toThrow();
    });

    it("deleteRecordsBefore should handle all kinds of input", () => {
      const repo = new DynoscaleRepository();
      expect(repo.getAll()).toEqual([]);
      expect(() => repo.deleteRecordsBefore(0)).not.toThrow();
      expect(() => repo.deleteRecordsBefore(1)).not.toThrow();
      expect(() => repo.deleteRecordsBefore(-1)).not.toThrow();
      expect(() => repo.deleteRecordsBefore(NaN)).not.toThrow();
      expect(() => repo.deleteRecordsBefore(Infinity)).not.toThrow();
      expect(() => repo.deleteRecordsBefore(-Infinity)).not.toThrow();
      expect(() => repo.deleteRecordsBefore(new Date().getTime())).not.toThrow();
    });
  });

  describe("that is not empty", () => {
    let repo: DynoscaleRepository;
    const RECORD_COUNT = 10;

    beforeEach(() => {
      // Create new repo
      repo = new DynoscaleRepository();
      // And add 10 records for the past 10 seconds
      const now = new Date().getTime();
      [...Array(RECORD_COUNT)]
        .map((_, i) => [now - 1000 * (RECORD_COUNT - i), i])
        .map(([timestamp, queueTime]) => repo.addRecord(new RequestLogRecord(timestamp, queueTime)));
    });

    afterEach(() => {
      repo = new DynoscaleRepository();
    });

    it("should return back correct number of records", () => {
      expect(() => repo.getAll()).not.toThrow();
      expect(() => repo.getAll().length).not.toThrow();
      expect(repo.getAll().length).toBe(RECORD_COUNT);
    });

    it("should return records correctly ordered", () => {
      const firstRecord = new RequestLogRecord(0, 99);
      const secondRecord = new RequestLogRecord(1, 99);
      repo.addRecord(secondRecord);
      repo.addRecord(firstRecord);

      expect(() => repo.getAll()).not.toThrow();
      expect(() => repo.getAll().length).not.toThrow();
      expect(repo.getAll().length).toBe(RECORD_COUNT + 2);
      expect(repo.getAll()[0]).toBe(firstRecord);
      expect(repo.getAll()[1]).toBe(secondRecord);
    });

    it("deleteRecordsOlderThan should handle all kinds of input", () => {
      expect(repo.getAll().length).toEqual(RECORD_COUNT);
      expect(() => repo.deleteRecordsOlderThan(0)).not.toThrow();
      expect(() => repo.deleteRecordsOlderThan(1)).not.toThrow();
      expect(() => repo.deleteRecordsOlderThan(-1)).not.toThrow();
      expect(() => repo.deleteRecordsOlderThan(NaN)).not.toThrow();
      expect(() => repo.deleteRecordsOlderThan(Infinity)).not.toThrow();
      expect(() => repo.deleteRecordsOlderThan(-Infinity)).not.toThrow();
      expect(() => repo.deleteRecordsOlderThan(new Date().getTime())).not.toThrow();
    });

    it("deleteRecordsBefore should handle all kinds of input", () => {
      expect(repo.getAll().length).toEqual(RECORD_COUNT);
      expect(() => repo.deleteRecordsBefore(0)).not.toThrow();
      expect(() => repo.deleteRecordsBefore(1)).not.toThrow();
      expect(() => repo.deleteRecordsBefore(-1)).not.toThrow();
      expect(() => repo.deleteRecordsBefore(NaN)).not.toThrow();
      expect(() => repo.deleteRecordsBefore(Infinity)).not.toThrow();
      expect(() => repo.deleteRecordsBefore(-Infinity)).not.toThrow();
      expect(() => repo.deleteRecordsBefore(new Date().getTime())).not.toThrow();
    });

    it("deleteRecordsBefore now should delete all records", () => {
      repo.deleteRecordsBefore(new Date().getTime());
      expect(repo.getAll().length).toEqual(0);
      expect(repo.getAll()).toEqual([]);
    });

    it("should return 1 records after deleting records before 1000ms ago", () => {
      repo.deleteRecordsBefore(new Date().getTime() - 1_500);
      expect(repo.getAll().length).toEqual(1);
    });

    it("should return 2 records after deleting records before 2000ms ago", () => {
      repo.deleteRecordsBefore(new Date().getTime() - 2_500);
      expect(repo.getAll().length).toEqual(2);
    });

    it("should return 9 records after deleting records before 9000ms ago", () => {
      repo.deleteRecordsBefore(new Date().getTime() - 9_500);
      expect(repo.getAll().length).toEqual(9);
    });

    it("should return 1 records after deleting records older than 1000ms", () => {
      repo.deleteRecordsOlderThan(1_500);
      expect(repo.getAll().length).toEqual(1);
    });

    it("should return 2 records after deleting records older than 2000ms", () => {
      repo.deleteRecordsOlderThan(2_500);
      expect(repo.getAll().length).toEqual(2);
    });

    it("should return 9 records after deleting records older than 9000ms", () => {
      repo.deleteRecordsOlderThan(9_500);
      expect(repo.getAll().length).toEqual(9);
    });
  });
});
