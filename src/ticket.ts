import * as moment from 'moment';

import { DATE_FORMAT, TIME_FORMAT } from './const';
import { LocationName } from './location';

export interface TicketOptions {
  origin: LocationName;
  destination: LocationName;
  date: Date;
  departureTime: Date;
  arrivalTime: Date;
  price: number;
}

export class Ticket {
  readonly origin: LocationName;
  readonly destination: LocationName;
  readonly date: Date;
  readonly departureTime: Date;
  readonly arrivalTime: Date;
  readonly price: number;

  constructor(options: TicketOptions) {
    this.origin = options.origin;
    this.destination = options.destination;
    this.date = options.date;
    this.departureTime = options.departureTime;
    this.arrivalTime = options.arrivalTime;
    this.price = options.price;
  }

  toString() {
    return `{$${this.price}} ${this.origin} -> ${this.destination} (${moment(this.date).format(DATE_FORMAT)} ` +
           `${moment(this.departureTime).format(TIME_FORMAT)} - ${moment(this.arrivalTime).format(TIME_FORMAT)})`;
  }
}
