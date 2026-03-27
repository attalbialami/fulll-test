import { FleetRepository } from "../Domain/fleet-repository";
import { VehicleRepository } from "../Domain/vehicle-repository";
import { ParkVehicleCommand } from "./park-vehicle-command";

export class ParkVehicleCommandHandler {
  constructor(
    private readonly fleetRepository: FleetRepository,
    private readonly vehicleRepository: VehicleRepository,
  ) {}

  handle(command: ParkVehicleCommand): void {
    const fleet = this.fleetRepository.findById(command.fleetId);
    const vehicle = this.vehicleRepository.findByPlateNumber(command.vehiclePlateNumber);

    if (!fleet.hasVehicle(vehicle)) {
      throw new Error("Vehicle is not registered in this fleet");
    }

    vehicle.park(command.location);

    this.vehicleRepository.save(vehicle);
  }
}

