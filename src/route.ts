import { LocationId, LocationIds, LocationName } from './location';

export class Route {
  readonly origin: LocationName;
  readonly originId: LocationId;
  readonly destination: LocationName;
  readonly destinationId: LocationId;

  constructor(origin: LocationName, destination: LocationName) {
    if (!LocationIds[origin]) {
      throw new Error(`Unknown origin: ${origin}`);
    }
    if (!LocationIds[destination]) {
      throw new Error(`Unknown destination: ${destination}`);
    }
    this.origin = origin;
    this.originId = LocationIds[origin];
    this.destination = destination;
    this.destinationId = LocationIds[destination];
  }
}
