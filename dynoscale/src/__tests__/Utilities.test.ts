import { isValidUrl } from "../utilities";

test("isValidUrl identifies invalid URLs", () => {
  // Invalid
  expect(isValidUrl(null)).toBe(false);
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
