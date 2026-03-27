import { Given, When, Then, Before } from "@cucumber/cucumber";
import assert from "assert";
import { Fleet } from "../../src/Domain/fleet";
import { Vehicle } from "../../src/Domain/vehicle";
import { Location } from "../../src/Domain/location";
import { InMemoryFleetRepository } from "../../src/Infra/in-memory-fleet-repository";
import { InMemoryVehicleRepository } from "../../src/Infra/in-memory-vehicle-repository";
import { RegisterVehicleCommand } from "../../src/App/register-vehicle-command";
import { RegisterVehicleCommandHandler } from "../../src/App/register-vehicle-command-handler";
import { ParkVehicleCommand } from "../../src/App/park-vehicle-command";
import { ParkVehicleCommandHandler } from "../../src/App/park-vehicle-command-handler";

interface TestWorld {
  fleet: Fleet;
  otherFleet: Fleet;
  vehicle: Vehicle;
  location: Location;
  fleetRepository: InMemoryFleetRepository;
  vehicleRepository: InMemoryVehicleRepository;
  registerHandler: RegisterVehicleCommandHandler;
  parkHandler: ParkVehicleCommandHandler;
  error: Error | null;
}

Before(function (this: TestWorld) {
  this.fleetRepository = new InMemoryFleetRepository();
  this.vehicleRepository = new InMemoryVehicleRepository();
  this.registerHandler = new RegisterVehicleCommandHandler(this.fleetRepository, this.vehicleRepository);
  this.parkHandler = new ParkVehicleCommandHandler(this.fleetRepository, this.vehicleRepository);
  this.error = null;
});

// --- Register vehicle steps ---

Given("my fleet", function (this: TestWorld) {
  this.fleet = new Fleet("fleet-1", "user-1");
  this.fleetRepository.save(this.fleet);
});

Given("a vehicle", function (this: TestWorld) {
  this.vehicle = new Vehicle("AB-123-CD");
});

Given("I have registered this vehicle into my fleet", function (this: TestWorld) {
  this.registerHandler.handle(new RegisterVehicleCommand(this.fleet.fleetId, this.vehicle.plateNumber));
});

Given("the fleet of another user", function (this: TestWorld) {
  this.otherFleet = new Fleet("fleet-2", "user-2");
  this.fleetRepository.save(this.otherFleet);
});

Given("this vehicle has been registered into the other user's fleet", function (this: TestWorld) {
  this.registerHandler.handle(new RegisterVehicleCommand(this.otherFleet.fleetId, this.vehicle.plateNumber));
});

When("I register this vehicle into my fleet", function (this: TestWorld) {
  this.registerHandler.handle(new RegisterVehicleCommand(this.fleet.fleetId, this.vehicle.plateNumber));
});

When("I try to register this vehicle into my fleet", function (this: TestWorld) {
  try {
    this.registerHandler.handle(new RegisterVehicleCommand(this.fleet.fleetId, this.vehicle.plateNumber));
  } catch (e) {
    this.error = e as Error;
  }
});

Then("this vehicle should be part of my vehicle fleet", function (this: TestWorld) {
  assert.ok(this.fleet.hasVehicle(this.vehicle));
});

Then("I should be informed this this vehicle has already been registered into my fleet", function (this: TestWorld) {
  assert.ok(this.error);
  assert.ok(this.error!.message.includes("already been registered"));
});

// --- Park vehicle steps ---

Given("a location", function (this: TestWorld) {
  this.location = new Location(48.8566, 2.3522);
});

Given("my vehicle has been parked into this location", function (this: TestWorld) {
  this.parkHandler.handle(new ParkVehicleCommand(this.fleet.fleetId, this.vehicle.plateNumber, this.location));
});

When("I park my vehicle at this location", function (this: TestWorld) {
  this.parkHandler.handle(new ParkVehicleCommand(this.fleet.fleetId, this.vehicle.plateNumber, this.location));
});

When("I try to park my vehicle at this location", function (this: TestWorld) {
  try {
    this.parkHandler.handle(new ParkVehicleCommand(this.fleet.fleetId, this.vehicle.plateNumber, this.location));
  } catch (e) {
    this.error = e as Error;
  }
});

Then("the known location of my vehicle should verify this location", function (this: TestWorld) {
  const vehicle = this.vehicleRepository.findByPlateNumber(this.vehicle.plateNumber);
  assert.ok(vehicle.location);
  assert.ok(vehicle.location!.equals(this.location));
});

Then("I should be informed that my vehicle is already parked at this location", function (this: TestWorld) {
  assert.ok(this.error);
  assert.ok(this.error!.message.includes("already parked"));
});

