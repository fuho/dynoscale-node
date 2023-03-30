import { Greeter } from "../index";

test("My Greeter", () => {
  expect(Greeter("World")).toBe("👋 Hello, World!");
});
