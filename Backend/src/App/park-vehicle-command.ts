import { Location } from "../Domain/location";

export class ParkVehicleCommand {
  constructor(
    readonly fleetId: string,
    readonly vehiclePlateNumber: string,
    readonly location: Location,
  ) {}
}

