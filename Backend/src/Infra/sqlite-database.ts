import Database from "better-sqlite3";

const DEFAULT_DB_PATH = "fleet.db";

export function createDatabase(dbPath: string = DEFAULT_DB_PATH): Database.Database {
  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  db.exec(`
    CREATE TABLE IF NOT EXISTS fleets (
      fleet_id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS vehicles (
      plate_number TEXT PRIMARY KEY,
      latitude REAL,
      longitude REAL,
      altitude REAL
    );

    CREATE TABLE IF NOT EXISTS fleet_vehicles (
      fleet_id TEXT NOT NULL,
      vehicle_plate_number TEXT NOT NULL,
      PRIMARY KEY (fleet_id, vehicle_plate_number),
      FOREIGN KEY (fleet_id) REFERENCES fleets(fleet_id),
      FOREIGN KEY (vehicle_plate_number) REFERENCES vehicles(plate_number)
    );
  `);

  return db;
}

