"use strict";

/*
 * This module loads Error and FailureInfo enum from ErrorReporter.sol.
 */

const path = require("path");
const solparse = require("solparse");

const errorReporterPath = path.join(
  __dirname,
  "..",
  "contracts",
  "ErrorReporter.sol"
);
const contents = solparse.parseFile(errorReporterPath);
const [GtrollerErrorReporter, TokenErrorReporter] = contents.body.filter(
  (k) => k.type === "ContractStatement"
);

function invert(object) {
  return Object.entries(object).reduce(
    (obj, [key, value]) => ({ ...obj, [value]: key }),
    {}
  );
}

function parse(reporter) {
  const ErrorInv = reporter.body.find((k) => k.name == "Error").members;
  const FailureInfoInv = reporter.body.find(
    (k) => k.name == "FailureInfo"
  ).members;
  const Error = invert(ErrorInv);
  const FailureInfo = invert(FailureInfoInv);
  return { Error, FailureInfo, ErrorInv, FailureInfoInv };
}

const carefulMathPath = path.join(
  __dirname,
  "..",
  "contracts",
  "CarefulMath.sol"
);
const CarefulMath = solparse
  .parseFile(carefulMathPath)
  .body.find((k) => k.type === "ContractStatement");
const MathErrorInv = CarefulMath.body.find(
  (k) => k.name == "MathError"
).members;
const MathError = invert(MathErrorInv);

module.exports = {
  GtrollerErr: parse(GtrollerErrorReporter),
  TokenErr: parse(TokenErrorReporter),
  MathErr: {
    Error: MathError,
    ErrorInv: MathErrorInv,
  },
};
