import { Before } from "@cucumber/cucumber";
import { InMemoryFleetRepository } from "../../src/Infra/in-memory-fleet-repository";
import { InMemoryVehicleRepository } from "../../src/Infra/in-memory-vehicle-repository";

interface World {
  fleetRepository: InMemoryFleetRepository;
  vehicleRepository: InMemoryVehicleRepository;
  error: Error | null;
}

Before(function (this: World) {
  this.fleetRepository = new InMemoryFleetRepository();
  this.vehicleRepository = new InMemoryVehicleRepository();
  this.error = null;
});
