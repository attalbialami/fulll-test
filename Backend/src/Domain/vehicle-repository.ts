import { Vehicle } from "./vehicle";

export interface VehicleRepository {
  save(vehicle: Vehicle): void;
  findByPlateNumber(plateNumber: string): Vehicle;
}
