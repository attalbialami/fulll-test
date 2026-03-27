# FizzBuzz — TypeScript

## Description

Classic FizzBuzz algorithm implemented in TypeScript with a **rule-based** approach for scalability.

## Rules

- Divisible by 3 → `Fizz`
- Divisible by 5 → `Buzz`
- Divisible by 3 **and** 5 → `FizzBuzz`
- Otherwise → the number itself

## Design Choices

### Scalability of the algorithm

The core logic is **rule-based**: FizzBuzz rules are defined as data (`{ divisor, label }`) rather than hardcoded `if/else` branches.

- **Adding a rule** (e.g. divisible by 7 → `"Jazz"`) requires zero code change — just append to the rules array
- **Removing or reordering rules** has no side effect on the rest of the logic
- The `fizzBuzz()` function accepts an optional `rules` parameter, allowing the caller to inject any set of rules
- This follows the **Open/Closed Principle**: open for extension, closed for modification — without over-engineering (no class hierarchy, no strategy pattern, just a typed array)

### Good practices and modern programming language features

| Practice | Where |
|---|---|
| **TypeScript `strict` mode** | `tsconfig.json` → `"strict": true`, no `any` |
| **`readonly`** properties & arrays | `FizzBuzzRule` fields, `DEFAULT_RULES` array |
| **`export type`** | Explicit public API for `FizzBuzzRule` |
| **`const` only** (no `let`/`var` except loop counter) | All files |
| **Short single-responsibility functions** | `fizzBuzz()` iterates, `convertNumber()` converts |
| **Zero production dependencies** | Tests use native `node:assert/strict` (modern `node:` protocol) |
| **Separation of concerns** | `fizzbuzz.ts` (logic), `main.ts` (CLI entry), `fizzbuzz.test.ts` (tests) |

## Install

```bash
npm install
```

## Run

```bash
npm start         # default N=100
npm start -- 20   # custom N
```

## Test

```bash
npm test
```

