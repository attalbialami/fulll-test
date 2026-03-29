import { Given, When, Then } from "@cucumber/cucumber";
import assert from "assert";
import { Fleet } from "../../src/Domain/fleet";
import { Vehicle } from "../../src/Domain/vehicle";
import { Location } from "../../src/Domain/location";
import { FleetRepository } from "../../src/Domain/fleet-repository";
import { VehicleRepository } from "../../src/Domain/vehicle-repository";
import { RegisterVehicleCommand } from "../../src/App/Commands/register-vehicle-command";
import { RegisterVehicleCommandHandler } from "../../src/App/Commands/register-vehicle-command-handler";
import { ParkVehicleCommand } from "../../src/App/Commands/park-vehicle-command";
import { ParkVehicleCommandHandler } from "../../src/App/Commands/park-vehicle-command-handler";
import { GetFleetQuery } from "../../src/App/Queries/get-fleet-query";
import { GetFleetQueryHandler } from "../../src/App/Queries/get-fleet-query-handler";
import { GetVehicleLocationQuery } from "../../src/App/Queries/get-vehicle-location-query";
import { GetVehicleLocationQueryHandler } from "../../src/App/Queries/get-vehicle-location-query-handler";

interface TestWorld {
  fleet: Fleet;
  otherFleet: Fleet;
  vehicle: Vehicle;
  location: Location;
  fleetRepository: FleetRepository;
  vehicleRepository: VehicleRepository;
  error: Error | null;
}

// --- Register vehicle steps ---

Given("my fleet", function (this: TestWorld) {
  this.fleet = new Fleet("fleet-1", "user-1");
  this.fleetRepository.save(this.fleet);
});

Given("a vehicle", function (this: TestWorld) {
  this.vehicle = new Vehicle("AB-123-CD");
  this.vehicleRepository.save(this.vehicle);
});

Given("I have registered this vehicle into my fleet", function (this: TestWorld) {
  const handler = new RegisterVehicleCommandHandler(this.fleetRepository, this.vehicleRepository);
  handler.handle(new RegisterVehicleCommand(this.fleet.fleetId, this.vehicle.plateNumber));
});

Given("the fleet of another user", function (this: TestWorld) {
  this.otherFleet = new Fleet("fleet-2", "user-2");
  this.fleetRepository.save(this.otherFleet);
});

Given("this vehicle has been registered into the other user's fleet", function (this: TestWorld) {
  const handler = new RegisterVehicleCommandHandler(this.fleetRepository, this.vehicleRepository);
  handler.handle(new RegisterVehicleCommand(this.otherFleet.fleetId, this.vehicle.plateNumber));
});

When("I register this vehicle into my fleet", function (this: TestWorld) {
  const handler = new RegisterVehicleCommandHandler(this.fleetRepository, this.vehicleRepository);
  handler.handle(new RegisterVehicleCommand(this.fleet.fleetId, this.vehicle.plateNumber));
});

When("I try to register this vehicle into my fleet", function (this: TestWorld) {
  try {
    const handler = new RegisterVehicleCommandHandler(this.fleetRepository, this.vehicleRepository);
    handler.handle(new RegisterVehicleCommand(this.fleet.fleetId, this.vehicle.plateNumber));
  } catch (e) {
    this.error = e as Error;
  }
});

Then("this vehicle should be part of my vehicle fleet", function (this: TestWorld) {
  const queryHandler = new GetFleetQueryHandler(this.fleetRepository);
  const fleet = queryHandler.handle(new GetFleetQuery(this.fleet.fleetId));
  assert.ok(fleet.hasVehicle(this.vehicle));
});

Then(
  "I should be informed this this vehicle has already been registered into my fleet",
  function (this: TestWorld) {
    assert.ok(this.error, "Expected an error to be thrown");
    assert.ok(this.error.message.includes("already been registered"));
  },
);

// --- Park vehicle steps ---

Given("a location", function (this: TestWorld) {
  this.location = new Location(48.8566, 2.3522);
});

Given("my vehicle has been parked into this location", function (this: TestWorld) {
  const handler = new ParkVehicleCommandHandler(this.fleetRepository, this.vehicleRepository);
  handler.handle(
    new ParkVehicleCommand(this.fleet.fleetId, this.vehicle.plateNumber, this.location),
  );
});

When("I park my vehicle at this location", function (this: TestWorld) {
  const handler = new ParkVehicleCommandHandler(this.fleetRepository, this.vehicleRepository);
  handler.handle(
    new ParkVehicleCommand(this.fleet.fleetId, this.vehicle.plateNumber, this.location),
  );
});

When("I try to park my vehicle at this location", function (this: TestWorld) {
  try {
    const handler = new ParkVehicleCommandHandler(this.fleetRepository, this.vehicleRepository);
    handler.handle(
      new ParkVehicleCommand(this.fleet.fleetId, this.vehicle.plateNumber, this.location),
    );
  } catch (e) {
    this.error = e as Error;
  }
});

Then("the known location of my vehicle should verify this location", function (this: TestWorld) {
  const queryHandler = new GetVehicleLocationQueryHandler(
    this.fleetRepository,
    this.vehicleRepository,
  );
  const location = queryHandler.handle(
    new GetVehicleLocationQuery(this.fleet.fleetId, this.vehicle.plateNumber),
  );
  assert.ok(location.equals(this.location), "Location should match");
});

Then(
  "I should be informed that my vehicle is already parked at this location",
  function (this: TestWorld) {
    assert.ok(this.error, "Expected an error to be thrown");
    assert.ok(this.error.message.includes("already parked"));
  },
);
