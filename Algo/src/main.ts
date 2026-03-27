import { fizzBuzz } from "./fizzbuzz.js";

const N = Number(process.argv[2]) || 100;

const result = fizzBuzz(N);

console.log(result.join("\n"));

