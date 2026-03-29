import { FleetRepository } from "../Domain/fleet-repository";
import { VehicleRepository } from "../Domain/vehicle-repository";
import { Vehicle } from "../Domain/vehicle";
import { RegisterVehicleCommand } from "./register-vehicle-command";

export class RegisterVehicleCommandHandler {
  constructor(
    private readonly fleetRepository: FleetRepository,
    private readonly vehicleRepository: VehicleRepository,
  ) {}

  handle(command: RegisterVehicleCommand): void {
    const fleet = this.fleetRepository.findById(command.fleetId);

    let vehicle: Vehicle;
    try {
      vehicle = this.vehicleRepository.findByPlateNumber(command.vehiclePlateNumber);
    } catch {
      vehicle = new Vehicle(command.vehiclePlateNumber);
    }

    fleet.addVehicle(vehicle);

    this.vehicleRepository.save(vehicle);
    this.fleetRepository.save(fleet);
  }
}
