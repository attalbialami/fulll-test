import { Fleet } from "./fleet";

export interface FleetRepository {
  save(fleet: Fleet): void;
  findById(fleetId: string): Fleet;
}
