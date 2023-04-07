import { DYNOSCALE_CLIENT_VERSION, isValidUrl, logRecordsToCsv } from "../utilities";
import { DynoscaleRepository, RequestLogRecord } from "../repository.js";

describe("GLOBAL CONSTANTS", () => {
  test("make sure DYNOSCALE_CLIENT_VERSION is available and valid", () => {
    expect(DYNOSCALE_CLIENT_VERSION).toBeDefined();
    expect(DYNOSCALE_CLIENT_VERSION).toEqual("0.0.4");
  });
});

describe("logRecordsToCsv", () => {
  test("empty csv string with no records", () => {
    expect(logRecordsToCsv(new DynoscaleRepository().getAll())).toEqual("");
  });

  test("csv format with simplest of records", () => {
    const repo = new DynoscaleRepository();
    repo.addRecord(new RequestLogRecord(0, 0));

    expect(logRecordsToCsv(repo.getAll())).toEqual("0,0,web,\n");
  });

  test("csv format export timestamp as seconds not millis", () => {
    const repo = new DynoscaleRepository();

    repo.addRecord(new RequestLogRecord(1680858268910, 1));
    expect(logRecordsToCsv(repo.getAll())).toEqual("1680858268,1,web,\n");
  });

  test("csv format export records in order", () => {
    const repo = new DynoscaleRepository();

    repo.addRecord(new RequestLogRecord(1680858267915, 2));
    repo.addRecord(new RequestLogRecord(1680858267910, 1));
    expect(logRecordsToCsv(repo.getAll())).toEqual("1680858267,1,web,\n1680858267,2,web,\n");
  });
});

describe("is_valid_url", () => {
  test("isValidUrl identifies invalid URLs", () => {
    // Invalid

    // expect(isValidUrl(null)).toBe(false);
    expect(isValidUrl("")).toBe(false);
    expect(isValidUrl("htp://example.com")).toBe(false);
    expect(isValidUrl("http:example.com")).toBe(false);
    expect(isValidUrl("http:/example.com")).toBe(false);
    expect(isValidUrl("http//example.com")).toBe(false);
    expect(isValidUrl("http::/example.com")).toBe(false);
    expect(isValidUrl("http:://example.com")).toBe(false);
    expect(isValidUrl("http:\\example.com")).toBe(false);
    expect(isValidUrl("http:\\\\example.com")).toBe(false);
    expect(isValidUrl("http://example")).toBe(false);
    expect(isValidUrl("htps://example.com")).toBe(false);
    expect(isValidUrl("https:example.com")).toBe(false);
    expect(isValidUrl("https:/example.com")).toBe(false);
    expect(isValidUrl("https//example.com")).toBe(false);
    expect(isValidUrl("https::/example.com")).toBe(false);
    expect(isValidUrl("https:://example.com")).toBe(false);
    expect(isValidUrl("https:\\example.com")).toBe(false);
    expect(isValidUrl("https:\\\\example.com")).toBe(false);
    expect(isValidUrl("https://example")).toBe(false);
  });

  test("isValidUrl identifies valid URLs", () => {
    // Valid
    expect(isValidUrl("http://example.com")).toBe(true);
    expect(isValidUrl("http://some.example.com")).toBe(true);
    expect(isValidUrl("http://some.example.com/")).toBe(true);
    expect(isValidUrl("http://some.example.com/one")).toBe(true);
    expect(isValidUrl("http://some.example.com/one?p1")).toBe(true);
    expect(isValidUrl("http://some.example.com/one?p1&p2")).toBe(true);
    expect(isValidUrl("http://some.example.com/one?p1&p2=false")).toBe(true);
    expect(isValidUrl("https://example.com")).toBe(true);
    expect(isValidUrl("https://some.example.com")).toBe(true);
    expect(isValidUrl("https://some.example.com/")).toBe(true);
    expect(isValidUrl("https://some.example.com/one")).toBe(true);
    expect(isValidUrl("https://some.example.com/one?p1")).toBe(true);
    expect(isValidUrl("https://some.example.com/one?p1&p2")).toBe(true);
    expect(isValidUrl("https://some.example.com/one?p1&p2=false")).toBe(true);
  });
});
