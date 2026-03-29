import { createDatabase } from "./sqlite-database";
import { SqliteFleetRepository } from "./sqlite-fleet-repository";
import { SqliteVehicleRepository } from "./sqlite-vehicle-repository";
import { CreateFleetCommand } from "../App/create-fleet-command";
import { CreateFleetCommandHandler } from "../App/create-fleet-command-handler";
import { RegisterVehicleCommand } from "../App/register-vehicle-command";
import { RegisterVehicleCommandHandler } from "../App/register-vehicle-command-handler";
import { ParkVehicleCommand } from "../App/park-vehicle-command";
import { ParkVehicleCommandHandler } from "../App/park-vehicle-command-handler";
import { Location } from "../Domain/location";

const USAGE = `Usage:
  fleet create <userId>
  fleet register-vehicle <fleetId> <vehiclePlateNumber>
  fleet localize-vehicle <fleetId> <vehiclePlateNumber> lat lng [alt]`;

function main(): void {
  const [command, ...args] = process.argv.slice(2);

  if (!command) {
    console.error(USAGE);
    process.exit(1);
  }

  const db = createDatabase();
  const fleetRepository = new SqliteFleetRepository(db);
  const vehicleRepository = new SqliteVehicleRepository(db);

  try {
    switch (command) {
      case "create":
        handleCreate(args, fleetRepository);
        break;
      case "register-vehicle":
        handleRegisterVehicle(args, fleetRepository, vehicleRepository);
        break;
      case "localize-vehicle":
        handleLocalizeVehicle(args, fleetRepository, vehicleRepository);
        break;
      default:
        console.error(USAGE);
        process.exit(1);
    }
  } catch (e) {
    console.error((e as Error).message);
    process.exit(1);
  } finally {
    db.close();
  }
}

function handleCreate(args: string[], fleetRepository: SqliteFleetRepository): void {
  const userId = args[0];
  if (!userId) {
    console.error("Usage: fleet create <userId>");
    process.exit(1);
  }

  const handler = new CreateFleetCommandHandler(fleetRepository);
  const fleetId = handler.handle(new CreateFleetCommand(userId));
  console.log(fleetId);
}

function handleRegisterVehicle(
  args: string[],
  fleetRepository: SqliteFleetRepository,
  vehicleRepository: SqliteVehicleRepository,
): void {
  const [fleetId, plateNumber] = args;
  if (!fleetId || !plateNumber) {
    console.error("Usage: fleet register-vehicle <fleetId> <vehiclePlateNumber>");
    process.exit(1);
  }

  const handler = new RegisterVehicleCommandHandler(fleetRepository, vehicleRepository);
  handler.handle(new RegisterVehicleCommand(fleetId, plateNumber));
}

function handleLocalizeVehicle(
  args: string[],
  fleetRepository: SqliteFleetRepository,
  vehicleRepository: SqliteVehicleRepository,
): void {
  const [fleetId, plateNumber, latStr, lngStr, altStr] = args;
  const lat = parseFloat(latStr);
  const lng = parseFloat(lngStr);
  const alt = altStr !== undefined ? parseFloat(altStr) : undefined;

  if (!fleetId || !plateNumber || isNaN(lat) || isNaN(lng)) {
    console.error("Usage: fleet localize-vehicle <fleetId> <vehiclePlateNumber> lat lng [alt]");
    process.exit(1);
  }

  const location = new Location(lat, lng, alt);
  const handler = new ParkVehicleCommandHandler(fleetRepository, vehicleRepository);
  handler.handle(new ParkVehicleCommand(fleetId, plateNumber, location));
}

main();
