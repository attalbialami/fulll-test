import { Before, After } from "@cucumber/cucumber";
import { createDatabase } from "../../src/Infra/sqlite-database";
import { SqliteFleetRepository } from "../../src/Infra/sqlite-fleet-repository";
import { SqliteVehicleRepository } from "../../src/Infra/sqlite-vehicle-repository";
import type Database from "better-sqlite3";

interface InfraWorld {
  db: Database.Database;
  fleetRepository: SqliteFleetRepository;
  vehicleRepository: SqliteVehicleRepository;
  error: Error | null;
}

Before({ tags: "@infra" }, function (this: InfraWorld) {
  this.db = createDatabase(":memory:");
  this.fleetRepository = new SqliteFleetRepository(this.db);
  this.vehicleRepository = new SqliteVehicleRepository(this.db);
  this.error = null;
});

After({ tags: "@infra" }, function (this: InfraWorld) {
  if (this.db) {
    this.db.close();
  }
});

