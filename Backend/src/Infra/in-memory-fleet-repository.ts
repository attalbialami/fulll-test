import { Fleet } from "../Domain/fleet";
import { FleetRepository } from "../Domain/fleet-repository";

export class InMemoryFleetRepository implements FleetRepository {
  private readonly fleets = new Map<string, Fleet>();

  save(fleet: Fleet): void {
    this.fleets.set(fleet.fleetId, fleet);
  }

  findById(fleetId: string): Fleet {
    const fleet = this.fleets.get(fleetId);
    if (!fleet) {
      throw new Error(`Fleet not found: ${fleetId}`);
    }
    return fleet;
  }
}
