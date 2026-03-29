import type Database from "better-sqlite3";
import { Fleet } from "../Domain/fleet";
import { FleetRepository } from "../Domain/fleet-repository";

export class SqliteFleetRepository implements FleetRepository {
  constructor(private readonly db: Database.Database) {}

  save(fleet: Fleet): void {
    this.db
      .prepare("INSERT OR REPLACE INTO fleets (fleet_id, user_id) VALUES (?, ?)")
      .run(fleet.fleetId, fleet.userId);

    for (const plateNumber of fleet.getVehiclePlateNumbers()) {
      this.db
        .prepare(
          "INSERT OR IGNORE INTO fleet_vehicles (fleet_id, vehicle_plate_number) VALUES (?, ?)",
        )
        .run(fleet.fleetId, plateNumber);
    }
  }

  findById(fleetId: string): Fleet {
    const row = this.db
      .prepare("SELECT fleet_id, user_id FROM fleets WHERE fleet_id = ?")
      .get(fleetId) as { fleet_id: string; user_id: string } | undefined;

    if (!row) {
      throw new Error(`Fleet not found: ${fleetId}`);
    }

    const fleet = new Fleet(row.fleet_id, row.user_id);

    const vehicleRows = this.db
      .prepare("SELECT vehicle_plate_number FROM fleet_vehicles WHERE fleet_id = ?")
      .all(fleetId) as { vehicle_plate_number: string }[];

    for (const vRow of vehicleRows) {
      fleet.restoreVehicle(vRow.vehicle_plate_number);
    }

    return fleet;
  }
}
