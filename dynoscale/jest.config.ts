import type { Config } from "jest";

export default async (): Promise<Config> => {
  return {
    verbose: true,
    preset: "ts-jest",
    testEnvironment: "node",
    rootDir: ".",
    clearMocks: true,
    coverageProvider: "v8",
    transform: {
      "^.+\\.tsx?$": "ts-jest",
    },
    moduleNameMapper: {
      "@/(.*)": "<rootDir>/src/$1",
    },

    moduleDirectories: ["node_modules", "src", "lib"],
    moduleFileExtensions: [
      "js",
      "mjs",
      "cjs",
      "jsx",
      "mjsx",
      "cjsx",
      "ts",
      "mts",
      "cts",
      "tsx",
      "mtsx",
      "ctsx",
      "json",
      "node",
    ],
    modulePaths: ["<rootDir>", "<rootDir>/src"],
    testPathIgnorePatterns: ["/dist/", "/node_modules/", "/lib/"],
  };
};
