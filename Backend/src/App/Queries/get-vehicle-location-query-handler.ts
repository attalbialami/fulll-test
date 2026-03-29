import { Location } from "../../Domain/location";
import { FleetRepository } from "../../Domain/fleet-repository";
import { VehicleRepository } from "../../Domain/vehicle-repository";
import { GetVehicleLocationQuery } from "./get-vehicle-location-query";

export class GetVehicleLocationQueryHandler {
  constructor(
    private readonly fleetRepository: FleetRepository,
    private readonly vehicleRepository: VehicleRepository,
  ) {}

  handle(query: GetVehicleLocationQuery): Location {
    const fleet = this.fleetRepository.findById(query.fleetId);
    const vehicle = this.vehicleRepository.findByPlateNumber(query.vehiclePlateNumber);

    if (!fleet.hasVehicle(vehicle)) {
      throw new Error("Vehicle is not registered in this fleet");
    }

    const location = vehicle.location;
    if (!location) {
      throw new Error("Vehicle has no location");
    }

    return location;
  }
}
