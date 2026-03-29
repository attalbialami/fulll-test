export class Location {
  constructor(
    readonly latitude: number,
    readonly longitude: number,
    readonly altitude?: number,
  ) {}

  equals(other: Location): boolean {
    return (
      this.latitude === other.latitude &&
      this.longitude === other.longitude &&
      this.altitude === other.altitude
    );
  }
}
