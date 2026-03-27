import { Location } from "./location";

export class Vehicle {
  readonly plateNumber: string;
  private _location: Location | null = null;

  constructor(plateNumber: string) {
    this.plateNumber = plateNumber;
  }

  get location(): Location | null {
    return this._location;
  }

  park(location: Location): void {
    if (this._location && this._location.equals(location)) {
      throw new Error("Vehicle is already parked at this location");
    }
    this._location = location;
  }
}

