import { randomUUID } from "crypto";
import { Fleet } from "../Domain/fleet";
import { FleetRepository } from "../Domain/fleet-repository";
import { CreateFleetCommand } from "./create-fleet-command";

export class CreateFleetCommandHandler {
  constructor(private readonly fleetRepository: FleetRepository) {}

  handle(command: CreateFleetCommand): string {
    const fleetId = randomUUID();
    const fleet = new Fleet(fleetId, command.userId);
    this.fleetRepository.save(fleet);
    return fleetId;
  }
}
