import { Vehicle } from "./vehicle";

export class Fleet {
  readonly fleetId: string;
  readonly userId: string;
  private readonly vehicles: Set<string> = new Set();

  constructor(fleetId: string, userId: string) {
    this.fleetId = fleetId;
    this.userId = userId;
  }

  addVehicle(vehicle: Vehicle): void {
    if (this.vehicles.has(vehicle.plateNumber)) {
      throw new Error("Vehicle has already been registered into this fleet");
    }
    this.vehicles.add(vehicle.plateNumber);
  }

  hasVehicle(vehicle: Vehicle): boolean {
    return this.vehicles.has(vehicle.plateNumber);
  }

  hasVehicleByPlateNumber(plateNumber: string): boolean {
    return this.vehicles.has(plateNumber);
  }

  getVehiclePlateNumbers(): ReadonlySet<string> {
    return this.vehicles;
  }

  restoreVehicle(plateNumber: string): void {
    this.vehicles.add(plateNumber);
  }
}

