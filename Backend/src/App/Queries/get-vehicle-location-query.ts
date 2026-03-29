export class GetVehicleLocationQuery {
  constructor(
    readonly fleetId: string,
    readonly vehiclePlateNumber: string,
  ) {}
}
