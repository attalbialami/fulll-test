import { Vehicle } from "../Domain/vehicle";
import { VehicleRepository } from "../Domain/vehicle-repository";

export class InMemoryVehicleRepository implements VehicleRepository {
  private readonly vehicles = new Map<string, Vehicle>();

  save(vehicle: Vehicle): void {
    this.vehicles.set(vehicle.plateNumber, vehicle);
  }

  findByPlateNumber(plateNumber: string): Vehicle {
    const vehicle = this.vehicles.get(plateNumber);
    if (!vehicle) {
      throw new Error(`Vehicle not found: ${plateNumber}`);
    }
    return vehicle;
  }
}

