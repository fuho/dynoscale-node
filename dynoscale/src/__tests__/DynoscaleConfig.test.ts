import { DynoscaleConfig, RunMode } from "../config.js";

describe("DynoscaleConfig", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Override process.env object before each test case:
    process.env = {};
    // By default, the value of process.env.NODE_ENV is test when running tests with jest
  });

  afterEach(() => {
    // Reset process.env value after each test case
    process.env = originalEnv;
  });

  it("should initialize valid with required env variables", () => {
    const DYNOSCALE_URL = "https://somewhere.net/api/v1/report";
    const DYNO = "web.1";
    process.env = { DYNOSCALE_URL, DYNO };
    const config = new DynoscaleConfig();
    expect(config.isValid).toBe(true);
    expect(config.dynoName).toEqual(DYNO);
    expect(config.dynoscaleUrl).toEqual(DYNOSCALE_URL);
    expect(config.runMode).toBe(RunMode.Production);
  });

  it("should initialize valid with required env variables in dev mode", () => {
    const DYNOSCALE_URL = "http://somewhere.else?api=key";
    const DYNO = "web.1";
    const DYNOSCALE_DEV_MODE = "";
    process.env = { DYNOSCALE_URL, DYNO, DYNOSCALE_DEV_MODE };
    const config = new DynoscaleConfig();
    expect(config.isValid).toBe(true);
    expect(config.dynoName).toEqual(DYNO);
    expect(config.dynoscaleUrl).toEqual(DYNOSCALE_URL);
    expect(config.runMode).toBe(RunMode.Development);
  });

  it("should initialize invalid on second DYNO", () => {
    const DYNOSCALE_URL = "https://somewhere.net/api/v1/report";
    const DYNO = "web.2";
    process.env = { DYNOSCALE_URL, DYNO };
    const config = new DynoscaleConfig();
    expect(config.isValid).toBe(false);
    expect(config.dynoName).toEqual(DYNO);
    expect(config.dynoscaleUrl).toEqual(DYNOSCALE_URL);
    expect(config.runMode).toBe(RunMode.Production);
  });

  it("should initialize invalid on non web DYNO", () => {
    const DYNOSCALE_URL = "https://somewhere.net/api/v1/report";
    const DYNO = "worker.1";
    process.env = { DYNOSCALE_URL, DYNO };
    const config = new DynoscaleConfig();
    expect(config.isValid).toBe(false);
    expect(config.dynoName).toEqual(DYNO);
    expect(config.dynoscaleUrl).toEqual(DYNOSCALE_URL);
    expect(config.runMode).toBe(RunMode.Production);
  });

  it("should initialize invalid with missing DYNO", () => {
    const DYNOSCALE_URL = "https://somewhere.net/api/v1/report";
    process.env = { DYNOSCALE_URL };
    const config = new DynoscaleConfig();
    expect(config.isValid).toBe(false);
    expect(config.dynoscaleUrl).toEqual(DYNOSCALE_URL);
    expect(config.runMode).toBe(RunMode.Production);
  });

  it("should initialize invalid when DYNOSCALE_URL missing", () => {
    const DYNO = "web.1";
    process.env = { DYNO };
    const config = new DynoscaleConfig();
    expect(config.dynoName).toEqual(DYNO);
    expect(config.isValid).toBe(false);
    expect(config.runMode).toBe(RunMode.Production);
  });

  it("should initialize invalid when DYNOSCALE_URL malformed", () => {
    const DYNOSCALE_URL = "https://somewhere..net/api/v1/report";
    const DYNO = "worker.1";
    process.env = { DYNOSCALE_URL, DYNO };
    const config = new DynoscaleConfig();
    expect(config.dynoName).toEqual(DYNO);
    expect(config.isValid).toBe(false);
    expect(config.runMode).toBe(RunMode.Production);
  });
});
