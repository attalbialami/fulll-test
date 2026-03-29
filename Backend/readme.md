# Vehicle Fleet Parking Management

[![Backend CI](https://github.com/attalbialami/fulll-test/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/attalbialami/fulll-test/actions/workflows/backend-ci.yml)

> DDD/CQRS in TypeScript — FULLL Technical Test

## What is this?

A **vehicle fleet parking management** system that allows fleet managers to:

- **Create** a vehicle fleet for a user
- **Register** vehicles into a fleet (with cross-fleet sharing)
- **Localize** vehicles at a GPS position (lat/lng/alt)

Built with **Domain-Driven Design** and **CQRS** — no framework, minimal dependencies.

## Requirements

- **Node.js** ≥ 18 (LTS)
- **npm** ≥ 9

## Install

```bash
npm install
```

## Running the tests

```bash
npm test                       # All in-memory BDD tests (default)
npm run test:critical          # @critical scenarios only
npm run test:infra             # Infrastructure tests (SQLite)
npm run test:coverage          # Tests with c8 coverage report
npm run ci                     # Full CI check: typecheck → lint → format → test
```

## CLI Usage

```bash
./fleet create <userId> # → prints fleetId
./fleet register-vehicle <fleetId> <vehiclePlateNumber>
./fleet localize-vehicle <fleetId> <vehiclePlateNumber> lat lng [alt]
```

> **Note**: On Linux/macOS, run `chmod +x fleet` first if needed.

## Architecture

```
src/
  App/
    Commands/  # Write side — Create fleet, Register vehicle, Park vehicle
    Queries/   # Read side — Get fleet, Get vehicle location
  Domain/      # Entities, Value Objects, Repository interfaces (pure DDD, zero deps)
  Infra/       # Concrete implementations (in-memory, SQLite, CLI)
features/
  *.feature              # Gherkin scenarios (BDD)
  step-definitions/      # Cucumber.js step definitions & hooks
```

### CQRS Separation

| Side      | Folder          | Responsibility                               | Used in                   |
| --------- | --------------- | -------------------------------------------- | ------------------------- |
| **Write** | `App/Commands/` | Create fleet, Register vehicle, Park vehicle | CLI, `Given`/`When` steps |
| **Read**  | `App/Queries/`  | Get fleet by ID, Get vehicle location        | `Then` steps (assertions) |

### Key Design Decisions

| Decision                                 | Rationale                                                                                                             |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **DDD + CQRS**                           | Explicit separation of write (Commands) and read (Queries) — each in its own folder under `App/`                      |
| **No framework** (no Express, no NestJS) | Assignment requirement + demonstrates raw Node.js proficiency                                                         |
| **SQLite** (better-sqlite3)              | Zero-config, portable — avoids Docker/PostgreSQL setup for reviewers. Repository pattern makes it trivially swappable |
| **In-memory first, SQL second**          | Domain tests run in milliseconds; SQLite tests validate persistence separately via Cucumber profiles                  |
| **Repository pattern**                   | Interface in `Domain/`, implementations in `Infra/` — persistence is a swappable detail, not a domain concern         |

## Step 3 — Code Quality & CI/CD

### Tools

| Tool                                  | Purpose                                                        |
| ------------------------------------- | -------------------------------------------------------------- |
| **ESLint** v9 + **typescript-eslint** | Static analysis — strict typing, no `any`, consistent patterns |
| **Prettier**                          | Opinionated formatter — eliminates style debates               |
| **tsc --noEmit**                      | Full type checking without emitting files                      |
| **c8**                                | Native V8 code coverage — zero overhead                        |
| **husky** + **lint-staged**           | Pre-commit hooks — lint/format only staged files               |
| **npm audit**                         | Security vulnerability detection (CVEs) in CI                  |

### CI/CD Pipeline

GitHub Actions (`.github/workflows/backend-ci.yml`) — triggered on push/PR to `master`, scoped to `Backend/**`:

| Job          | What it does                                        |
| ------------ | --------------------------------------------------- |
| **Quality**  | `tsc --noEmit` → `eslint .` → `prettier --check .`  |
| **Tests**    | BDD tests (in-memory + SQLite) with coverage report |
| **Security** | `npm audit --audit-level=high`                      |

### Pre-commit hooks

On `git commit`, **lint-staged** automatically runs ESLint + Prettier on staged files only — fast feedback, no dirty code committed.
