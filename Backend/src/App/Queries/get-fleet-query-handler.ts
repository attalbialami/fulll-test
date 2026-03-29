import { Fleet } from "../../Domain/fleet";
import { FleetRepository } from "../../Domain/fleet-repository";
import { GetFleetQuery } from "./get-fleet-query";

export class GetFleetQueryHandler {
  constructor(private readonly fleetRepository: FleetRepository) {}

  handle(query: GetFleetQuery): Fleet {
    return this.fleetRepository.findById(query.fleetId);
  }
}
