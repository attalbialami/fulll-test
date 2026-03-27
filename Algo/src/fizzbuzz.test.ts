import assert from "node:assert/strict";
import { fizzBuzz } from "./fizzbuzz.js";

function runTests(): void {
  testBasicNumbers();
  testFizz();
  testBuzz();
  testFizzBuzz();
  testFullSequence();
  testCustomRules();
  testEdgeCases();

  console.log(">> All tests passed!");
}

function testBasicNumbers(): void {
  const result = fizzBuzz(2);
  assert.deepStrictEqual(result, ["1", "2"]);
  console.log("  > regular numbers");
}

function testFizz(): void {
  const result = fizzBuzz(3);
  assert.strictEqual(result[2], "Fizz");
  console.log("  > divisible by 3 → Fizz");
}

function testBuzz(): void {
  const result = fizzBuzz(5);
  assert.strictEqual(result[4], "Buzz");
  console.log("  > divisible by 5 → Buzz");
}

function testFizzBuzz(): void {
  const result = fizzBuzz(15);
  assert.strictEqual(result[14], "FizzBuzz");
  console.log("  > divisible by 3 AND 5 → FizzBuzz");
}

function testFullSequence(): void {
  const result = fizzBuzz(15);
  const expected = [
    "1", "2", "Fizz", "4", "Buzz",
    "Fizz", "7", "8", "Fizz", "Buzz",
    "11", "Fizz", "13", "14", "FizzBuzz",
  ];
  assert.deepStrictEqual(result, expected);
  console.log("  > full sequence 1–15");
}

function testCustomRules(): void {
  const result = fizzBuzz(7, [
    { divisor: 2, label: "Foo" },
    { divisor: 7, label: "Bar" },
  ]);
  assert.deepStrictEqual(result, ["1", "Foo", "3", "Foo", "5", "Foo", "Bar"]);
  console.log("  > custom rules (scalability)");
}

function testEdgeCases(): void {
  assert.deepStrictEqual(fizzBuzz(1), ["1"]);
  assert.deepStrictEqual(fizzBuzz(0), []);
  console.log("  > edge cases (n=1, n=0)");
}

runTests();

