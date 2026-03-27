export type FizzBuzzRule = {
  readonly divisor: number;
  readonly label: string;
};

const DEFAULT_RULES: readonly FizzBuzzRule[] = [
  { divisor: 3, label: "Fizz" },
  { divisor: 5, label: "Buzz" },
];

export function fizzBuzz(n: number, rules: readonly FizzBuzzRule[] = DEFAULT_RULES): string[] {
  const result: string[] = [];
  for (let i = 1; i <= n; i++) {
    result.push(convertNumber(i, rules));
  }
  return result;
}

function convertNumber(num: number, rules: readonly FizzBuzzRule[]): string {
  const result = rules
    .filter((rule) => num % rule.divisor === 0)
    .map((rule) => rule.label)
    .join("");

  return result || String(num);
}
