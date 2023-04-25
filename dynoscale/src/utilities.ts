import { Request } from "express";

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
