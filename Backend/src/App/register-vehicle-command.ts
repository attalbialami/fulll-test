export class RegisterVehicleCommand {
  constructor(
    readonly fleetId: string,
    readonly vehiclePlateNumber: string,
  ) {}
}

