import type Database from "better-sqlite3";
import { Vehicle } from "../Domain/vehicle";
import { Location } from "../Domain/location";
import { VehicleRepository } from "../Domain/vehicle-repository";

export class SqliteVehicleRepository implements VehicleRepository {
  constructor(private readonly db: Database.Database) {}

  save(vehicle: Vehicle): void {
    const loc = vehicle.location;
    this.db
      .prepare(
        "INSERT OR REPLACE INTO vehicles (plate_number, latitude, longitude, altitude) VALUES (?, ?, ?, ?)",
      )
      .run(
        vehicle.plateNumber,
        loc ? loc.latitude : null,
        loc ? loc.longitude : null,
        loc ? (loc.altitude ?? null) : null,
      );
  }

  findByPlateNumber(plateNumber: string): Vehicle {
    const row = this.db
      .prepare(
        "SELECT plate_number, latitude, longitude, altitude FROM vehicles WHERE plate_number = ?",
      )
      .get(plateNumber) as
      | {
          plate_number: string;
          latitude: number | null;
          longitude: number | null;
          altitude: number | null;
        }
      | undefined;

    if (!row) {
      throw new Error(`Vehicle not found: ${plateNumber}`);
    }

    const vehicle = new Vehicle(row.plate_number);

    if (row.latitude !== null && row.longitude !== null) {
      const location = new Location(row.latitude, row.longitude, row.altitude ?? undefined);
      vehicle.park(location);
    }

    return vehicle;
  }
}
